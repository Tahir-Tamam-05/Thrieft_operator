from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class ClothingCategory(str, Enum):
    MEN = "Men"
    WOMEN = "Women"
    KIDS = "Kids"
    ACCESSORIES = "Accessories"
    MIXED = "Mixed/Textile Waste"

class ClothingCondition(str, Enum):
    EXCELLENT = "Excellent"
    GOOD = "Good"
    FAIR = "Fair"
    NEEDS_REPAIR = "Needs Repair"

class DonationStatus(str, Enum):
    SCHEDULED = "Scheduled"
    PICKED_UP = "Picked Up"
    PROCESSED = "Processed"
    COMPLETED = "Completed"

class Size(str, Enum):
    XS = "XS"
    S = "S"
    M = "M"
    L = "L"
    XL = "XL"
    XXL = "XXL"

# Models
class DonationRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    donor_name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: str
    pickup_date: str
    pickup_time: str
    categories: List[ClothingCategory]
    estimated_weight: Optional[float] = None
    special_instructions: Optional[str] = None
    photos: List[str] = Field(default_factory=list)
    tracking_id: str = Field(default_factory=lambda: f"DN{str(uuid.uuid4())[:8].upper()}")
    status: DonationStatus = DonationStatus.SCHEDULED
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    processed_at: Optional[datetime] = None
    assigned_agent: Optional[str] = None
    points_earned: int = 0

class DonationRequestCreate(BaseModel):
    donor_name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: str
    pickup_date: str
    pickup_time: str
    categories: List[ClothingCategory]
    estimated_weight: Optional[float] = None
    special_instructions: Optional[str] = None

class ThriftItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: ClothingCategory
    size: Size
    condition: ClothingCondition
    price: float
    original_donation_id: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    is_available: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    sold_at: Optional[datetime] = None

class ThriftItemCreate(BaseModel):
    name: str
    description: str
    category: ClothingCategory
    size: Size
    condition: ClothingCondition
    price: float
    original_donation_id: Optional[str] = None
    images: List[str] = Field(default_factory=list)

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    total_donations: int = 0
    total_points: int = 0
    badges: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_donation: Optional[datetime] = None

class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None

class ImpactStats(BaseModel):
    total_clothes_collected_kg: float
    total_items_reused: int
    total_items_recycled: int
    carbon_footprint_saved_kg: float
    total_donors: int
    total_revenue_generated: float

class CartItem(BaseModel):
    item_id: str
    quantity: int = 1

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    items: List[CartItem]
    total_amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "Pending"

# Helper functions
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if key.endswith('_at') and isinstance(value, str):
                try:
                    item[key] = datetime.fromisoformat(value)
                except:
                    pass
    return item

# Routes
@api_router.get("/")
async def root():
    return {"message": "Thrift Clothing API - Give Clothes a Second Life!"}

@api_router.get("/health")
async def health():
    return {"status": "ok"}

# Donation routes
@api_router.post("/donations", response_model=DonationRequest)
async def create_donation_request(donation_data: DonationRequestCreate):
    """Create a new clothing donation request"""
    donation_dict = donation_data.dict()
    donation_obj = DonationRequest(**donation_dict)
    
    # Calculate points based on estimated weight
    if donation_obj.estimated_weight:
        donation_obj.points_earned = int(donation_obj.estimated_weight * 10)  # 10 points per kg
    
    donation_dict_prepared = prepare_for_mongo(donation_obj.dict())
    await db.donations.insert_one(donation_dict_prepared)
    return donation_obj

@api_router.get("/donations", response_model=List[DonationRequest])
async def get_donations():
    """Get all donation requests"""
    donations = await db.donations.find().to_list(1000)
    return [DonationRequest(**parse_from_mongo(donation)) for donation in donations]

@api_router.get("/donations/{tracking_id}", response_model=DonationRequest)
async def get_donation_by_tracking_id(tracking_id: str):
    """Get donation by tracking ID"""
    donation = await db.donations.find_one({"tracking_id": tracking_id})
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return DonationRequest(**parse_from_mongo(donation))

@api_router.put("/donations/{donation_id}/status")
async def update_donation_status(donation_id: str, new_status: DonationStatus, assigned_agent: Optional[str] = None):
    """Update donation status (Admin only)"""
    update_data = {"status": new_status}
    if assigned_agent:
        update_data["assigned_agent"] = assigned_agent
    if new_status == DonationStatus.COMPLETED:
        update_data["processed_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.donations.update_one(
        {"id": donation_id}, 
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Donation not found")
    return {"message": "Status updated successfully"}

# Thrift store routes
@api_router.post("/thrift-items", response_model=ThriftItem)
async def create_thrift_item(item_data: ThriftItemCreate):
    """Add new item to thrift store (Admin only)"""
    item_obj = ThriftItem(**item_data.dict())
    item_dict_prepared = prepare_for_mongo(item_obj.dict())
    await db.thrift_items.insert_one(item_dict_prepared)
    return item_obj

@api_router.get("/thrift-items", response_model=List[ThriftItem])
async def get_thrift_items(
    category: Optional[ClothingCategory] = None,
    size: Optional[Size] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    condition: Optional[ClothingCondition] = None
):
    """Get thrift store items with optional filters"""
    query = {"is_available": True}
    
    if category:
        query["category"] = category
    if size:
        query["size"] = size
    if condition:
        query["condition"] = condition
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    
    items = await db.thrift_items.find(query).to_list(1000)
    return [ThriftItem(**parse_from_mongo(item)) for item in items]

@api_router.get("/thrift-items/{item_id}", response_model=ThriftItem)
async def get_thrift_item(item_id: str):
    """Get single thrift item"""
    item = await db.thrift_items.find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return ThriftItem(**parse_from_mongo(item))

# Impact tracking routes
@api_router.get("/impact-stats", response_model=ImpactStats)
async def get_impact_stats():
    """Get environmental impact statistics"""
    # Calculate stats from database
    donations = await db.donations.find().to_list(1000)
    thrift_items = await db.thrift_items.find().to_list(1000)
    
    total_weight = sum(d.get("estimated_weight", 0) for d in donations)
    total_items_reused = len([item for item in thrift_items if item.get("sold_at")])
    total_items_recycled = len(donations) - total_items_reused
    carbon_saved = total_weight * 2.1  # Approximate carbon savings per kg
    total_donors = len(set(d.get("email") for d in donations))
    total_revenue = sum(item.get("price", 0) for item in thrift_items if item.get("sold_at"))
    
    return ImpactStats(
        total_clothes_collected_kg=total_weight,
        total_items_reused=total_items_reused,
        total_items_recycled=total_items_recycled,
        carbon_footprint_saved_kg=carbon_saved,
        total_donors=total_donors,
        total_revenue_generated=total_revenue
    )

# User management routes
@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    """Create a new user"""
    user_obj = User(**user_data.dict())
    user_dict_prepared = prepare_for_mongo(user_obj.dict())
    await db.users.insert_one(user_dict_prepared)
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user profile"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**parse_from_mongo(user))

# Mock data seeding endpoint (for development)
@api_router.post("/seed-mock-data")
async def seed_mock_data():
    """Seed database with mock data for development"""
    
    # Clear existing data
    await db.donations.delete_many({})
    await db.thrift_items.delete_many({})
    await db.users.delete_many({})
    
    # Sample thrift items with the collected images
    mock_items = [
        {
            "name": "Vintage Denim Jacket",
            "description": "Classic blue denim jacket in excellent condition",
            "category": ClothingCategory.MEN,
            "size": Size.M,
            "condition": ClothingCondition.EXCELLENT,
            "price": 35.99,
            "images": ["https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8"]
        },
        {
            "name": "Vintage Floral Sweater",
            "description": "Multicolored vintage sweater with unique pattern",
            "category": ClothingCategory.WOMEN,
            "size": Size.L,
            "condition": ClothingCondition.GOOD,
            "price": 28.50,
            "images": ["https://images.unsplash.com/photo-1733026019726-ca2354a60358"]
        },
        {
            "name": "Classic Blue Jeans",
            "description": "Comfortable blue denim jeans",
            "category": ClothingCategory.WOMEN,
            "size": Size.M,
            "condition": ClothingCondition.GOOD,
            "price": 22.99,
            "images": ["https://images.unsplash.com/photo-1614990354198-b06764dcb13c"]
        },
        {
            "name": "Vintage Leather Shoes",
            "description": "Classic leather shoes in great condition",
            "category": ClothingCategory.ACCESSORIES,
            "size": Size.M,
            "condition": ClothingCondition.EXCELLENT,
            "price": 45.00,
            "images": ["https://images.pexels.com/photos/2918534/pexels-photo-2918534.jpeg"]
        },
        {
            "name": "Casual Summer Shirt",
            "description": "Light casual shirt perfect for summer",
            "category": ClothingCategory.MEN,
            "size": Size.L,
            "condition": ClothingCondition.GOOD,
            "price": 18.75,
            "images": ["https://images.unsplash.com/photo-1647664856968-880b8eccd588"]
        },
        {
            "name": "Vintage Clothing Collection",
            "description": "Assorted vintage pieces in good condition",
            "category": ClothingCategory.MIXED,
            "size": Size.M,
            "condition": ClothingCondition.FAIR,
            "price": 32.00,
            "images": ["https://images.unsplash.com/photo-1520006403909-838d6b92c22e"]
        }
    ]
    
    # Insert thrift items
    for item_data in mock_items:
        item_obj = ThriftItem(**item_data)
        item_dict_prepared = prepare_for_mongo(item_obj.dict())
        await db.thrift_items.insert_one(item_dict_prepared)
    
    # Sample donations
    mock_donations = [
        {
            "donor_name": "Sarah Johnson",
            "email": "sarah@example.com",
            "phone": "555-0101",
            "address": "123 Green Street",
            "city": "Eco City",
            "postal_code": "12345",
            "pickup_date": "2024-01-15",
            "pickup_time": "10:00 AM",
            "categories": [ClothingCategory.WOMEN, ClothingCategory.ACCESSORIES],
            "estimated_weight": 5.5,
            "status": DonationStatus.COMPLETED
        },
        {
            "donor_name": "Michael Chen",
            "email": "michael@example.com",
            "phone": "555-0102",
            "address": "456 Sustainability Ave",
            "city": "Green Town",
            "postal_code": "67890",
            "pickup_date": "2024-01-20",
            "pickup_time": "2:00 PM",
            "categories": [ClothingCategory.MEN],
            "estimated_weight": 8.2,
            "status": DonationStatus.PROCESSED
        }
    ]
    
    for donation_data in mock_donations:
        donation_obj = DonationRequest(**donation_data)
        donation_dict_prepared = prepare_for_mongo(donation_obj.dict())
        await db.donations.insert_one(donation_dict_prepared)
    
    return {"message": "Mock data seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

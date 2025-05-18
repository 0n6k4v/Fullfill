from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date

class DashboardSummary(BaseModel):
    totalRequests: int
    totalDonations: int
    fulfilledRequests: int
    activeUsers: int
    requestGrowth: Optional[float] = None
    donationGrowth: Optional[float] = None
    fulfillmentGrowth: Optional[float] = None
    userGrowth: Optional[float] = None

class TrendDataPoint(BaseModel):
    date: date
    count: int

class CategoryDistributionPoint(BaseModel):
    category: str
    requests: int
    donations: int

class DashboardCharts(BaseModel):
    requestTrends: List[TrendDataPoint]
    donationTrends: List[TrendDataPoint]
    categoryDistribution: List[CategoryDistributionPoint]

class NeededItem(BaseModel):
    categoryName: str
    icon: Optional[str] = None # Frontend will map this to an icon
    totalRequestsInCategory: int
    availableDonationsInCategory: int
    shortage: int # Positive if shortage, negative if surplus
    fulfillmentRate: Optional[float] = None # Percentage
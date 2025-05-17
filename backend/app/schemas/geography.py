from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class GeometryModel(BaseModel):
    type: str
    coordinates: List[Any]

# Province Schemas
class ProvinceBase(BaseModel):
    province_name: str
    reg_nesdb: Optional[str] = None
    reg_royin: Optional[str] = None
    perimeter: Optional[float] = None
    area_sqkm: Optional[float] = None

class Province(ProvinceBase):
    id: int
    geometry: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# District Schemas
class DistrictBase(BaseModel):
    district_name: str
    province_id: int
    perimeter: Optional[float] = None
    area_sqkm: Optional[float] = None

class District(DistrictBase):
    id: int
    geometry: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

# Subdistrict Schemas
class SubdistrictBase(BaseModel):
    subdistrict_name: str
    district_id: int
    perimeter: Optional[float] = None
    area_sqkm: Optional[float] = None

class Subdistrict(SubdistrictBase):
    id: int
    geometry: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

# Response schemas with nested relationships
class ProvinceWithDistricts(Province):
    districts: List[District] = []

class DistrictWithSubdistricts(District):
    subdistricts: List[Subdistrict] = []

class SubdistrictDetail(Subdistrict):
    district: Optional[District] = None
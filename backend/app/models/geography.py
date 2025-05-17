from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.db.base import Base

class Province(Base):
    __tablename__ = "provinces"

    id = Column(Integer, primary_key=True, index=True)
    province_name = Column(String, nullable=False)
    reg_nesdb = Column(String)
    reg_royin = Column(String)
    perimeter = Column(Float)
    area_sqkm = Column(Float)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    
    # Relationships
    districts = relationship("District", back_populates="province")

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    province_id = Column(Integer, ForeignKey("provinces.id"))
    district_name = Column(String, nullable=False)
    perimeter = Column(Float)
    area_sqkm = Column(Float)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    
    # Relationships
    province = relationship("Province", back_populates="districts")
    subdistricts = relationship("Subdistrict", back_populates="district")

class Subdistrict(Base):
    __tablename__ = "subdistricts"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("districts.id"))
    subdistrict_name = Column(String, nullable=False)
    perimeter = Column(Float)
    area_sqkm = Column(Float)
    geom = Column(Geometry("MULTIPOLYGON", srid=4326))
    
    # Relationships
    district = relationship("District", back_populates="subdistricts")
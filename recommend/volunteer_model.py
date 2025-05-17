from sqlalchemy import Column, BigInteger, String, Integer, Enum
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Volunteer(Base):
    __tablename__ = 'volunteer'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    detail = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    fcm_token = Column(String(255), nullable=True)
    gender = Column(Enum('female', 'male'), nullable=True)
    name = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    profile_image = Column(String(255), nullable=True)
    username = Column(String(255), nullable=True)
    volunteer_category = Column(Integer, nullable=True)
    bio = Column(String(255), nullable=True)
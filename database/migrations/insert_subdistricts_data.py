# import os
# import asyncio
# import asyncpg
# from dotenv import load_dotenv
# import geojson

# # ฟังก์ชันสำหรับอ่านไฟล์ GeoJSON
# def read_geojson(file_path):
#     with open(file_path, 'r', encoding='utf-8') as f:
#         return geojson.load(f)

# # ฟังก์ชันสำหรับแปลง Geometry เป็น WKT (Well-Known Text)
# def geometry_to_wkt(geometry):
#     if geometry['type'] == 'MultiPolygon':
#         coordinates = geometry['coordinates']
#         polygons = []
#         for polygon in coordinates:
#             rings = []
#             for ring in polygon:
#                 points = ["{} {}".format(coord[0], coord[1]) for coord in ring]
#                 rings.append("({})".format(", ".join(points)))
#             polygons.append("({})".format(", ".join(rings)))
#         return "MULTIPOLYGON({})".format(", ".join(polygons))
#     else:
#         raise ValueError("Geometry type not supported")

# # ฟังก์ชันสำหรับ Insert ข้อมูลลงในตาราง subdistricts
# async def insert_subdistricts(geojson_data, conn):
#     insert_query = """
#         INSERT INTO subdistricts (id, district_id, subdistrict_name, perimeter, area_sqkm, geom)
#         VALUES ($1::INTEGER, $2::INTEGER, $3, $4::FLOAT, $5::FLOAT, ST_GeomFromText($6, 4326))
#         ON CONFLICT (id) DO NOTHING; -- ข้ามข้อมูลที่ซ้ำ
#     """
    
#     seen_tam_codes = set()  # ใช้เซ็ตเพื่อตรวจสอบ tam_code ซ้ำใน GeoJSON
#     for feature in geojson_data['features']:
#         properties = feature['properties']
#         geometry = feature['geometry']
        
#         subdistrict_id = int(properties.get('tam_code'))  # ใช้ tam_code เป็น ID
        
#         if subdistrict_id in seen_tam_codes:
#             print(f"Duplicate tam_code found in GeoJSON: {subdistrict_id}")
#             continue  # ข้ามข้อมูลที่ซ้ำ
        
#         seen_tam_codes.add(subdistrict_id)
        
#         district_id = int(properties.get('amp_code'))    # ใช้ amp_code เป็น district_id
#         subdistrict_name = properties.get('tam_th')
#         perimeter = float(properties.get('perimeter'))
#         area_sqkm = float(properties.get('area_sqkm'))
#         geom_wkt = geometry_to_wkt(geometry)
        
#         await conn.execute(insert_query, subdistrict_id, district_id, subdistrict_name, perimeter, area_sqkm, geom_wkt)

# # เมธอดหลัก
# async def main():
#     # Load .env file
#     load_dotenv()

#     # Get the connection string from the environment variable
#     connection_string = os.getenv('DATABASE_URL')

#     # Create a connection pool
#     pool = await asyncpg.create_pool(connection_string)

#     # อ่านไฟล์ GeoJSON
#     geojson_file = "subdistricts.geojson"  # ระบุพาธไฟล์ GeoJSON
#     geojson_data = read_geojson(geojson_file)

#     try:
#         # Acquire a connection from the pool
#         async with pool.acquire() as conn:
#             # Insert ข้อมูลลงในตาราง subdistricts
#             await insert_subdistricts(geojson_data, conn)
#             print("Data inserted successfully!")
#     except Exception as e:
#         print(f"Error: {e}")
#     finally:
#         # Close the pool
#         await pool.close()

# # Run the asynchronous main function
# asyncio.run(main())

import os
import asyncio
import asyncpg
from dotenv import load_dotenv
import geojson

# ฟังก์ชันสำหรับอ่านไฟล์ GeoJSON
def read_geojson(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return geojson.load(f)

# ฟังก์ชันสำหรับแปลง Geometry เป็น WKT (Well-Known Text)
def geometry_to_wkt(geometry):
    if geometry['type'] == 'MultiPolygon':
        coordinates = geometry['coordinates']
        polygons = []
        for polygon in coordinates:
            rings = []
            for ring in polygon:
                points = ["{} {}".format(coord[0], coord[1]) for coord in ring]
                rings.append("({})".format(", ".join(points)))
            polygons.append("({})".format(", ".join(rings)))
        return "MULTIPOLYGON({})".format(", ".join(polygons))
    else:
        raise ValueError("Geometry type not supported")

# ฟังก์ชันสำหรับ Insert ข้อมูลลงในตาราง subdistricts
async def insert_subdistricts(geojson_data, conn):
    insert_query = """
        INSERT INTO subdistricts (id, district_id, subdistrict_name, perimeter, area_sqkm, geom)
        VALUES ($1::INTEGER, $2::INTEGER, $3, $4::FLOAT, $5::FLOAT, ST_GeomFromText($6, 4326))
        ON CONFLICT (id) DO NOTHING; -- ข้ามข้อมูลที่ซ้ำ
    """
    
    seen_tam_codes = set()  # ใช้เซ็ตเพื่อตรวจสอบ tam_code ซ้ำใน GeoJSON
    for feature in geojson_data['features']:
        properties = feature['properties']
        geometry = feature['geometry']
        
        subdistrict_id = int(properties.get('tam_code'))  # ใช้ tam_code เป็น ID
        
        if subdistrict_id in seen_tam_codes:
            print(f"Duplicate tam_code found in GeoJSON: {subdistrict_id}")
            continue  # ข้ามข้อมูลที่ซ้ำ
        
        seen_tam_codes.add(subdistrict_id)
        
        district_id = int(properties.get('amp_code'))    # ใช้ amp_code เป็น district_id
        subdistrict_name = properties.get('tam_th')
        perimeter = float(properties.get('perimeter'))
        area_sqkm = float(properties.get('area_sqkm'))
        geom_wkt = geometry_to_wkt(geometry)
        
        await conn.execute(insert_query, subdistrict_id, district_id, subdistrict_name, perimeter, area_sqkm, geom_wkt)

# เมธอดหลัก
async def main():
    # Load .env file
    load_dotenv()

    # กำหนดค่าการเชื่อมต่อฐานข้อมูลสำหรับ Docker container
    DB_USER = os.getenv('DB_USER', 'postgres')  # ชื่อผู้ใช้ใน container
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')  # รหัสผ่านใน container
    DB_HOST = os.getenv('DB_HOST', 'db')  # ชื่อ service ของ database ใน docker-compose
    DB_PORT = os.getenv('DB_PORT', '5432')  # Default port
    DB_NAME = os.getenv('DB_NAME', 'fullfill')  # ชื่อฐานข้อมูล

    # สร้าง connection string
    connection_string = f"postgresql://fullfill_user:ZHQFDW9lwIIRTSn9ce4d2mgJ09UOXYMM@dpg-d0kl2tvfte5s738phbr0-a.oregon-postgres.render.com/fullfill_hcph"
    # อ่านไฟล์ GeoJSON
    geojson_file = "subdistricts.geojson"  # ระบุพาธไฟล์ GeoJSON
    geojson_data = read_geojson(geojson_file)

    try:
        # เชื่อมต่อกับฐานข้อมูล
        conn = await asyncpg.connect(connection_string)

        # Insert ข้อมูลลงในตาราง subdistricts
        await insert_subdistricts(geojson_data, conn)
        print("Data inserted successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # ปิดการเชื่อมต่อ
        await conn.close()

# Run the asynchronous main function
asyncio.run(main())
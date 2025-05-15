import React from 'react';
import Header from './components/Header';
import ImageGallery from './components/ImageGallery';
import ItemDetails from './components/ItemDetails';
import SimilarItems from './components/SimilarItems';
import Footer from '../../components/Footer';

const DonationDetail = () => {
  const images = [
    "https://readdy.ai/api/search-image?query=A%20high-quality%20wooden%20bookshelf%20with%204%20shelves%2C%20made%20of%20solid%20oak%20wood%20with%20a%20warm%20honey%20finish%2C%20empty%20shelves%20ready%20for%20books%2C%20photographed%20against%20a%20clean%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting&width=600&height=500&seq=1&orientation=portrait",
    "https://readdy.ai/api/search-image?query=A%20wooden%20bookshelf%20with%204%20shelves%20viewed%20from%20a%20different%20angle%2C%20showing%20the%20sturdy%20construction%20and%20smooth%20finish%2C%20empty%20shelves%20ready%20for%20use%2C%20photographed%20against%20a%20clean%20white%20background%20with%20soft%20shadows&width=600&height=500&seq=2&orientation=portrait",
    "https://readdy.ai/api/search-image?query=Close-up%20detail%20of%20a%20wooden%20bookshelf%20showing%20the%20quality%20craftsmanship%2C%20wood%20grain%20texture%2C%20and%20corner%20joints%2C%20professional%20product%20photography%20with%20soft%20lighting%20against%20a%20clean%20white%20background&width=600&height=500&seq=3&orientation=portrait",
  ];

  const item = {
    title: "ชั้นวางหนังสือ",
    location: "ซาน ฟรานซิสโก, CA",
    distance: "0.8 ไมล์",
    description: "ชั้นวางหนังสือไม้พร้อมชั้นวาง 4 ชั้น แข็งแรงและอยู่ในสภาพดี เหมาะสำหรับห้องนั่งเล่นหรือห้องทำงาน ทำจากไม้โอ๊คคุณภาพดี มีสีน้ำตาลอ่อนที่สวยงาม ขนาดกว้าง 80 ซม. สูง 160 ซม. ลึก 30 ซม.",
    tags: ["เฟอร์นิเจอร์", "สภาพ: ดี", "จำนวน: 1"],
    donorName: "ผู้บริจาคสินค้าบ้าน",
    postedTime: "4 วันที่ผ่านมา",
    details: {
      "วัสดุ": "ไม้โอ๊ค",
      "สี": "น้ำตาลอ่อน",
      "ขนาด": "80 x 160 x 30 ซม.",
      "น้ำหนัก": "ประมาณ 15 กก."
    },
    pickupLocation: "ซาน ฟรานซิสโก, CA - 0.8 ไมล์จากตำแหน่งของคุณ",
    pickupTime: "จันทร์-ศุกร์: 17:00-20:00 น., เสาร์-อาทิตย์: 10:00-18:00 น."
  };

  const similarItems = [1, 2, 3, 4].map((id) => ({
    id,
    image: `https://readdy.ai/api/search-image?query=Modern%20wooden%20furniture%20piece%2C%20minimalist%20design%2C%20clean%20lines%2C%20photographed%20against%20a%20neutral%20background%20with%20professional%20lighting%2C%20showing%20craftsmanship%20details&width=300&height=200&seq=${id}&orientation=landscape`,
    title: "ชั้นวางของไม้",
    type: "การบริจาค",
    location: "ซาน ฟรานซิสโก",
    distance: "1.2 ไมล์",
    tags: ["เฟอร์นิเจอร์", "สภาพ: ดี"],
    postedTime: "2 วันที่ผ่านมา"
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <ImageGallery images={images} type="การบริจาค" />
            <ItemDetails item={item} />
          </div>
        </div>
        <SimilarItems items={similarItems} />
      </main>
      
      <Footer />
    </div>
  );
};

export default DonationDetail;
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from './models/User.js';
import Brand from './models/Brand.js';
import VehicleModel from './models/VehicleModel.js';
import Inquiry from './models/Inquiry.js';
import InquiryStatusLog from './models/InquiryStatusLog.js';
import Estimate from './models/Estimate.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vehicle_dealership';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Brand.deleteMany({});
    await VehicleModel.deleteMany({});
    await Inquiry.deleteMany({});
    await InquiryStatusLog.deleteMany({});
    await Estimate.deleteMany({});

    console.log('Cleared existing collection data.');

    // 1. Create Default Admin / Sales User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Showroom Admin',
      email: 'admin@dealership.com',
      password: hashedPassword,
      role: 'admin',
      theme: 'dark'
    });
    console.log('Created Default User: admin@dealership.com / password123');

    // 2. Create Brands
    const brandTata = await Brand.create({ name: 'Tata Motors', logo: '', status: 'active' });
    const brandMahindra = await Brand.create({ name: 'Mahindra & Mahindra', logo: '', status: 'active' });
    const brandHyundai = await Brand.create({ name: 'Hyundai India', logo: '', status: 'active' });
    const brandMaruti = await Brand.create({ name: 'Maruti Suzuki', logo: '', status: 'active' });

    console.log('Created Brands.');

    // 3. Create Vehicle Models
    const modelHarrier = await VehicleModel.create({
      brand: brandTata._id,
      name: 'Tata Harrier',
      variant: 'Fearless Plus Dark Edition',
      on_road_price: 2650000,
      ex_showroom_price: 2350000,
      fuel_type: 'Diesel',
      transmission: 'Automatic'
    });

    const modelNexon = await VehicleModel.create({
      brand: brandTata._id,
      name: 'Tata Nexon.ev',
      variant: 'Empowered Plus LR',
      on_road_price: 1820000,
      ex_showroom_price: 1699000,
      fuel_type: 'Electric',
      transmission: 'Automatic'
    });

    const modelThar = await VehicleModel.create({
      brand: brandMahindra._id,
      name: 'Mahindra Thar ROXX',
      variant: 'AX7 L 4WD',
      on_road_price: 2390000,
      ex_showroom_price: 2099000,
      fuel_type: 'Diesel',
      transmission: 'Automatic'
    });

    const modelCreta = await VehicleModel.create({
      brand: brandHyundai._id,
      name: 'Hyundai Creta',
      variant: 'SX (O) Turbo Petrol',
      on_road_price: 2150000,
      ex_showroom_price: 1999000,
      fuel_type: 'Petrol',
      transmission: 'Automatic'
    });

    console.log('Created Vehicle Models.');

    // 4. Create Sample Inquiries
    const inquiry1 = await Inquiry.create({
      customer_name: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@example.com',
      brand: brandTata._id,
      model: modelHarrier._id,
      source: 'walk-in',
      status: 'Estimate Sent',
      notes: 'Customer interested in Dark Edition color. Requested exchange evaluation for old Swift.',
      user: user._id
    });

    await InquiryStatusLog.create({
      inquiry: inquiry1._id,
      old_status: null,
      new_status: 'New',
      changed_by: user._id
    });

    await InquiryStatusLog.create({
      inquiry: inquiry1._id,
      old_status: 'New',
      new_status: 'Estimate Sent',
      changed_by: user._id
    });

    const inquiry2 = await Inquiry.create({
      customer_name: 'Priya Patel',
      phone: '+91 91234 56789',
      email: 'priya.patel@example.com',
      brand: brandMahindra._id,
      model: modelThar._id,
      source: 'online',
      status: 'Negotiation',
      notes: 'Test drive scheduled for coming Saturday.',
      user: user._id
    });

    await InquiryStatusLog.create({
      inquiry: inquiry2._id,
      old_status: null,
      new_status: 'New',
      changed_by: user._id
    });

    await InquiryStatusLog.create({
      inquiry: inquiry2._id,
      old_status: 'New',
      new_status: 'Contacted',
      changed_by: user._id
    });

    await InquiryStatusLog.create({
      inquiry: inquiry2._id,
      old_status: 'Contacted',
      new_status: 'Negotiation',
      changed_by: user._id
    });

    const inquiry3 = await Inquiry.create({
      customer_name: 'Amit Verma',
      phone: '+91 99887 76655',
      email: 'amit.verma@example.com',
      brand: brandHyundai._id,
      model: modelCreta._id,
      source: 'phone',
      status: 'Converted',
      notes: 'Full payment completed. Vehicle booking ID #88912.',
      user: user._id
    });

    await InquiryStatusLog.create({
      inquiry: inquiry3._id,
      old_status: null,
      new_status: 'New',
      changed_by: user._id
    });

    await InquiryStatusLog.create({
      inquiry: inquiry3._id,
      old_status: 'New',
      new_status: 'Converted',
      changed_by: user._id
    });

    // 5. Create Sample Estimate
    await Estimate.create({
      inquiry: inquiry1._id,
      on_road_price: 2650000,
      discount: 45000,
      accessories_cost: 25000,
      insurance: 75000,
      rto_charges: 185000,
      total_amount: 2890000
    });

    console.log('Created Sample Inquiries and Estimates.');
    console.log('Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

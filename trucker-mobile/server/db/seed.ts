import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

const thaiCities = [
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Khon Kaen', 'Hat Yai', 'Nakhon Ratchasima',
  'Udon Thani', 'Chonburi', 'Surat Thani', 'Rayong', 'Samut Prakan', 'Nonthaburi', 'Pathum Thani',
  'Ayutthaya', 'Lopburi', 'Saraburi', 'Nakhon Pathom', 'Prachuap Khiri Khan', 'Hua Hin'
];

const thaiNames = [
  'Somchai', 'Somsak', 'Sompong', 'Pranee', 'Wilai', 'Nittaya', 'Thongchai', 'Boonmee',
  'Chalerm', 'Suwan', 'Prasit', 'Manee', 'Suda', 'Ratana', 'Anong', 'Sawat', 'Wichai',
  'Prayut', 'Thaksin', 'Yingluck', 'Abhisit', 'Chuan', 'Samak', 'Chatichai', 'Thanin'
];

const thaiLastNames = [
  'Srisawat', 'Phongphaew', 'Suwannapha', 'Rattanaporn', 'Chaiyasit', 'Boonkerd', 'Siripong',
  'Kittikul', 'Wongsa', 'Prasertsin', 'Tangsiri', 'Vejjajiva', 'Shinawatra', 'Leekpai',
  'Silpa-archa', 'Chulanont', 'Sundaravej', 'Choonhavan', 'Kraivixien', 'Panyarachun'
];

const companyTypes = [
  'Logistics', 'Transport', 'Freight', 'Cargo', 'Shipping', 'Distribution', 'Express', 'Trucking'
];

const productCategories = [
  'Electronics', 'Food & Beverages', 'Machinery', 'Textiles', 'Chemicals', 'Pharmaceuticals',
  'Automotive Parts', 'Construction Materials', 'Agricultural Products', 'Consumer Goods',
  'Medical Equipment', 'Furniture', 'Paper Products', 'Plastics', 'Metal Products'
];

const vehicleBrands = ['Isuzu', 'Hino', 'Mitsubishi Fuso', 'UD Trucks', 'Volvo', 'Scania', 'Mercedes-Benz', 'MAN'];
const vehicleColors = ['White', 'Blue', 'Red', 'Silver', 'Green', 'Yellow', 'Orange', 'Black'];
const bodyTypes = ['Box Truck', 'Flatbed', 'Refrigerated', 'Tanker', 'Container', 'Dump Truck', 'Trailer'];

const expenseCategories = [
  'Fuel', 'Tolls', 'Maintenance', 'Loading Services', 'Permits', 'Parking', 'Meals',
  'Accommodation', 'Vehicle Wash', 'Emergency Repairs', 'Documentation', 'Insurance'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePhone(): string {
  return `0${randomInt(8, 9)}${randomInt(1, 9)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`;
}

function generateRegistration(): string {
  const letters = 'กขคงจฉชซฌญฎฏฐฑฒณ';
  return `${randomElement(letters.split(''))}${randomElement(letters.split(''))} ${randomInt(1000, 9999)}`;
}

async function seed() {
  console.log('Starting seed...');

  console.log('Clearing existing data...');
  await db.delete(schema.messages);
  await db.delete(schema.conversationParticipants);
  await db.delete(schema.conversations);
  await db.delete(schema.expenses);
  await db.delete(schema.revenues);
  await db.delete(schema.bids);
  await db.delete(schema.jobStops);
  await db.delete(schema.jobs);
  await db.delete(schema.vehicles);
  await db.delete(schema.products);
  await db.delete(schema.customers);
  await db.delete(schema.users);

  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('12345', 10);
  
  const userRecords = [
    { username: 'admin', email: 'admin@trucker.com', role: 'admin' as const, displayName: 'Alex Walker', firstName: 'Alex', lastName: 'Walker' },
    { username: 'admin2', email: 'admin2@trucker.com', role: 'admin' as const, displayName: 'Sarah Chen', firstName: 'Sarah', lastName: 'Chen' },
    { username: 'admin3', email: 'admin3@trucker.com', role: 'admin' as const, displayName: 'Michael Brown', firstName: 'Michael', lastName: 'Brown' },
    { username: 'company', email: 'company@trucker.com', role: 'company' as const, displayName: 'Acme Logistics', firstName: 'Acme', lastName: 'Logistics' },
    { username: 'company2', email: 'company2@trucker.com', role: 'company' as const, displayName: 'Swift Transport', firstName: 'Swift', lastName: 'Transport' },
    { username: 'company3', email: 'company3@trucker.com', role: 'company' as const, displayName: 'Express Freight', firstName: 'Express', lastName: 'Freight' },
    { username: 'customer', email: 'customer@trucker.com', role: 'customer' as const, displayName: 'John Smith', firstName: 'John', lastName: 'Smith' },
    { username: 'customer2', email: 'customer2@trucker.com', role: 'customer' as const, displayName: 'Jane Doe', firstName: 'Jane', lastName: 'Doe' },
    { username: 'customer3', email: 'customer3@trucker.com', role: 'customer' as const, displayName: 'Robert Johnson', firstName: 'Robert', lastName: 'Johnson' },
    { username: 'shipping', email: 'shipping@trucker.com', role: 'shipping' as const, displayName: 'Tom Driver', firstName: 'Tom', lastName: 'Driver' },
    { username: 'shipping2', email: 'shipping2@trucker.com', role: 'shipping' as const, displayName: 'Mike Trucker', firstName: 'Mike', lastName: 'Trucker' },
    { username: 'shipping3', email: 'shipping3@trucker.com', role: 'shipping' as const, displayName: 'Sam Wheeler', firstName: 'Sam', lastName: 'Wheeler' },
    { username: 'shipping4', email: 'shipping4@trucker.com', role: 'shipping' as const, displayName: 'David Roadman', firstName: 'David', lastName: 'Roadman' },
    { username: 'shipping5', email: 'shipping5@trucker.com', role: 'shipping' as const, displayName: 'Chris Hauler', firstName: 'Chris', lastName: 'Hauler' },
    { username: 'shipping6', email: 'shipping6@trucker.com', role: 'shipping' as const, displayName: 'Pete Cargo', firstName: 'Pete', lastName: 'Cargo' },
  ];

  const users = await db.insert(schema.users).values(
    userRecords.map(u => ({
      ...u,
      password: hashedPassword,
      phone: generatePhone(),
    }))
  ).returning();

  console.log(`Created ${users.length} users`);

  console.log('Creating customers...');
  const customerRecords = [];
  for (let i = 0; i < 150; i++) {
    const firstName = randomElement(thaiNames);
    const lastName = randomElement(thaiLastNames);
    const isCompany = Math.random() > 0.4;
    
    customerRecords.push({
      name: isCompany 
        ? `${firstName} ${randomElement(companyTypes)} Co., Ltd.`
        : `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}${i}@example.com`,
      phone: generatePhone(),
      address: `${randomInt(1, 999)} ${randomElement(['Sukhumvit', 'Silom', 'Rama IV', 'Phahonyothin', 'Ratchadaphisek'])} Road`,
      city: randomElement(thaiCities),
      region: randomElement(['Central', 'North', 'Northeast', 'East', 'South', 'West']),
      contactPerson: isCompany ? `${randomElement(thaiNames)} ${randomElement(thaiLastNames)}` : undefined,
      totalOrders: randomInt(0, 50),
      totalRevenue: (randomInt(10000, 5000000)).toString(),
    });
  }

  const customers = await db.insert(schema.customers).values(customerRecords).returning();
  console.log(`Created ${customers.length} customers`);

  console.log('Creating products...');
  const productRecords = [];
  const productNames = [
    'Industrial Motor', 'Steel Beam', 'Electronic Components', 'Fresh Produce', 'Frozen Seafood',
    'Pharmaceutical Supplies', 'Automotive Battery', 'Textile Fabric', 'Chemical Compound', 'Cement Bags',
    'Rice Sacks', 'Rubber Sheets', 'Plastic Pellets', 'Paper Rolls', 'Glass Panels', 'Aluminum Sheets',
    'Copper Wire', 'LED Displays', 'Solar Panels', 'Air Conditioner Units', 'Refrigerator Units',
    'Washing Machines', 'Television Sets', 'Computer Monitors', 'Laptop Computers', 'Smartphone Boxes',
    'Medical Supplies', 'Laboratory Equipment', 'Agricultural Seeds', 'Fertilizer Bags', 'Animal Feed',
    'Beverages Cartons', 'Snack Food Boxes', 'Dairy Products', 'Meat Products', 'Bakery Items',
    'Clothing Boxes', 'Shoe Cartons', 'Furniture Pieces', 'Mattresses', 'Office Chairs',
    'Construction Tools', 'Power Tools', 'Plumbing Supplies', 'Electrical Cables', 'Paint Cans'
  ];

  for (let i = 0; i < 90; i++) {
    const baseName = randomElement(productNames);
    const category = randomElement(productCategories);
    productRecords.push({
      name: `${baseName} ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      category,
      description: `High-quality ${baseName.toLowerCase()} for ${category.toLowerCase()} industry`,
      unit: randomElement(['pieces', 'boxes', 'pallets', 'kg', 'tons', 'containers']),
      weight: (randomInt(1, 5000)).toString(),
      dimensions: `${randomInt(10, 200)}x${randomInt(10, 200)}x${randomInt(10, 200)} cm`,
      requiresRefrigeration: category.includes('Food') || category.includes('Pharma'),
      isHazardous: category === 'Chemicals',
    });
  }

  const products = await db.insert(schema.products).values(productRecords).returning();
  console.log(`Created ${products.length} products`);

  console.log('Creating vehicles...');
  const driverUsers = users.filter(u => u.role === 'shipping');
  const vehicleRecords = [];
  
  for (let i = 0; i < 45; i++) {
    vehicleRecords.push({
      registrationNumber: generateRegistration(),
      registrationProvince: randomElement(thaiCities),
      vin: `TH${Date.now().toString(36).toUpperCase()}${i.toString().padStart(3, '0')}`,
      brand: randomElement(vehicleBrands),
      model: `Model ${randomElement(['A', 'B', 'C', 'D', 'E'])}${randomInt(100, 999)}`,
      color: randomElement(vehicleColors),
      bodyType: randomElement(bodyTypes),
      plateType: randomElement(['Commercial', 'Private', 'Government']),
      payload: (randomInt(2000, 30000)).toString(),
      serviceYears: randomInt(1, 15),
      status: randomElement(['available', 'available', 'available', 'in_use', 'maintenance']) as any,
      driverId: i < driverUsers.length ? driverUsers[i % driverUsers.length].id : null,
      hasTrailer: Math.random() > 0.6,
      trailerRegistration: Math.random() > 0.6 ? generateRegistration() : null,
      insuranceValue: (randomInt(100000, 2000000)).toString(),
    });
  }

  const vehicles = await db.insert(schema.vehicles).values(vehicleRecords).returning();
  console.log(`Created ${vehicles.length} vehicles`);

  console.log('Creating jobs...');
  const jobRecords = [];
  const now = new Date();
  const eighteenMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 18, 1);
  
  const jobStatuses = ['completed', 'completed', 'completed', 'in_progress', 'pending', 'cancelled'] as const;

  for (let i = 0; i < 65; i++) {
    const status = randomElement(jobStatuses);
    const origin = randomElement(thaiCities);
    let destination = randomElement(thaiCities);
    while (destination === origin) {
      destination = randomElement(thaiCities);
    }
    
    const createdAt = randomDate(eighteenMonthsAgo, now);
    const pickupDate = new Date(createdAt.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000);
    const deliveryDate = new Date(pickupDate.getTime() + randomInt(1, 5) * 24 * 60 * 60 * 1000);

    jobRecords.push({
      jobNumber: `JOB-${(i + 1).toString().padStart(5, '0')}`,
      customerId: randomElement(customers).id,
      vehicleId: randomElement(vehicles).id,
      driverId: randomElement(driverUsers).id,
      status,
      origin,
      destination,
      distance: (randomInt(50, 1500)).toString(),
      estimatedDuration: `${randomInt(2, 48)} hours`,
      cargo: randomElement(products).name,
      cargoWeight: (randomInt(500, 25000)).toString(),
      temperature: Math.random() > 0.7 ? `${randomInt(-20, 10)}°C` : null,
      price: (randomInt(5000, 150000)).toString(),
      progress: status === 'completed' ? 100 : status === 'in_progress' ? randomInt(10, 90) : 0,
      notes: Math.random() > 0.5 ? `Special handling required. Contact driver before arrival.` : null,
      pickupDate,
      deliveryDate,
      completedAt: status === 'completed' ? deliveryDate : null,
      createdAt,
    });
  }

  const jobs = await db.insert(schema.jobs).values(jobRecords).returning();
  console.log(`Created ${jobs.length} jobs`);

  console.log('Creating job stops...');
  const stopRecords = [];
  
  for (const job of jobs) {
    const numStops = randomInt(2, 5);
    for (let s = 0; s < numStops; s++) {
      stopRecords.push({
        jobId: job.id,
        sequence: s + 1,
        name: s === 0 ? 'Pickup Point' : s === numStops - 1 ? 'Delivery Point' : `Stop ${s}`,
        address: `${randomInt(1, 999)} ${randomElement(['Main', 'Industrial', 'Commercial', 'Port'])} Road, ${randomElement(thaiCities)}`,
        contact: `${randomElement(thaiNames)} ${randomElement(thaiLastNames)}`,
        phone: generatePhone(),
        cargo: s === 0 ? 'Load cargo' : s === numStops - 1 ? 'Unload cargo' : 'Partial delivery',
        status: job.status === 'completed' ? 'completed' : job.status === 'in_progress' && s < 2 ? 'completed' : 'pending',
        checkedIn: job.status === 'completed' || (job.status === 'in_progress' && s < 2),
        notes: Math.random() > 0.7 ? 'Call before arrival' : null,
      });
    }
  }

  const stops = await db.insert(schema.jobStops).values(stopRecords).returning();
  console.log(`Created ${stops.length} job stops`);

  console.log('Creating expenses...');
  const expenseRecords = [];
  
  for (const job of jobs.filter(j => j.status !== 'pending')) {
    const numExpenses = randomInt(2, 8);
    for (let e = 0; e < numExpenses; e++) {
      const category = randomElement(expenseCategories);
      const amount = category === 'Fuel' ? randomInt(1000, 5000) :
                     category === 'Tolls' ? randomInt(100, 500) :
                     category === 'Maintenance' ? randomInt(500, 10000) :
                     randomInt(50, 2000);
      
      expenseRecords.push({
        jobId: job.id,
        userId: job.driverId,
        title: `${category} - ${job.jobNumber}`,
        category,
        amount: amount.toString(),
        currency: 'THB',
        description: `${category} expense for job ${job.jobNumber}`,
        date: randomDate(new Date(job.createdAt!), job.completedAt || now),
      });
    }
  }

  const expensesData = await db.insert(schema.expenses).values(expenseRecords).returning();
  console.log(`Created ${expensesData.length} expenses`);

  console.log('Creating revenues...');
  const revenueRecords = [];
  
  for (const job of jobs.filter(j => j.status === 'completed' || j.status === 'in_progress')) {
    const isPaid = job.status === 'completed' && Math.random() > 0.2;
    const amount = parseFloat(job.price || '0') * (0.9 + Math.random() * 0.2);
    
    revenueRecords.push({
      jobId: job.id,
      customerId: job.customerId,
      invoiceNumber: `INV-${job.jobNumber?.replace('JOB-', '')}`,
      amount: Math.round(amount).toString(),
      currency: 'THB',
      status: isPaid ? 'paid' : Math.random() > 0.5 ? 'pending' : 'overdue',
      dueDate: new Date((job.deliveryDate?.getTime() || Date.now()) + 30 * 24 * 60 * 60 * 1000),
      paidAt: isPaid ? randomDate(job.completedAt || now, now) : null,
      paymentMethod: isPaid ? randomElement(['Bank Transfer', 'Cash', 'Check', 'Credit']) : null,
    });
  }

  const revenuesData = await db.insert(schema.revenues).values(revenueRecords).returning();
  console.log(`Created ${revenuesData.length} revenues`);

  console.log('Creating bids...');
  const bidRecords = [];
  const bidStatuses = ['open', 'open', 'submitted', 'accepted', 'rejected', 'expired'] as const;
  
  for (let i = 0; i < 40; i++) {
    const status = randomElement(bidStatuses);
    const origin = randomElement(thaiCities);
    let destination = randomElement(thaiCities);
    while (destination === origin) {
      destination = randomElement(thaiCities);
    }
    
    const requestedPrice = randomInt(5000, 100000);
    
    bidRecords.push({
      bidNumber: `BID-${(i + 1).toString().padStart(5, '0')}`,
      customerId: randomElement(customers).id,
      origin,
      destination,
      cargo: randomElement(products).name,
      cargoWeight: (randomInt(500, 20000)).toString(),
      requestedPrice: requestedPrice.toString(),
      submittedPrice: status !== 'open' ? (requestedPrice * (0.8 + Math.random() * 0.4)).toFixed(0) : null,
      status,
      pickupDate: randomDate(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)),
      expiresAt: randomDate(now, new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)),
      notes: Math.random() > 0.6 ? 'Urgent delivery required' : null,
    });
  }

  const bidsData = await db.insert(schema.bids).values(bidRecords).returning();
  console.log(`Created ${bidsData.length} bids`);

  console.log('Creating conversations and messages...');
  const conversationRecords = [];
  
  for (let i = 0; i < 20; i++) {
    const isGroup = Math.random() > 0.6;
    conversationRecords.push({
      type: isGroup ? 'group' : 'private' as const,
      name: isGroup ? `${randomElement(['Drivers', 'Team', 'Project', 'Route'])} Chat ${i + 1}` : null,
      createdById: randomElement(users).id,
    });
  }

  const conversationsData = await db.insert(schema.conversations).values(conversationRecords).returning();

  for (const conv of conversationsData) {
    const numParticipants = conv.type === 'group' ? randomInt(3, 8) : 2;
    const participantUsers = [...users].sort(() => Math.random() - 0.5).slice(0, numParticipants);
    
    for (let p = 0; p < participantUsers.length; p++) {
      await db.insert(schema.conversationParticipants).values({
        conversationId: conv.id,
        userId: participantUsers[p].id,
        isAdmin: p === 0,
      });
    }

    const numMessages = randomInt(5, 30);
    const messageTexts = [
      'Hello!', 'How are you?', 'When is the delivery?', 'On my way', 'Arrived at location',
      'Package delivered', 'Thanks!', 'Need help with this', 'Can you check?', 'Confirmed',
      'Running a bit late', 'Traffic is heavy', 'Almost there', 'Job completed', 'Great work!',
      'Please update the status', 'Got it', 'Will do', 'See you tomorrow', 'Good morning',
      'Good evening', 'Have a safe trip', 'Weather is bad', 'Taking a break', 'Back on the road'
    ];

    for (let m = 0; m < numMessages; m++) {
      await db.insert(schema.messages).values({
        conversationId: conv.id,
        senderId: randomElement(participantUsers).id,
        content: randomElement(messageTexts),
        messageType: 'text',
        isRead: m < numMessages - 3,
        createdAt: randomDate(eighteenMonthsAgo, now),
      });
    }
  }

  console.log(`Created ${conversationsData.length} conversations with messages`);

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

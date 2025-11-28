const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
require('dotenv').config();

// Sample events data
const sampleEvents = [
    {
        title: "Tech Innovation Summit 2024",
        description: "Join us for an exciting day of technology talks, workshops, and networking. Learn about the latest trends in AI, blockchain, and cloud computing from industry experts.",
        date: new Date('2024-12-15'),
        time: "09:00 AM",
        venue: "Main Auditorium, Building A",
        category: "Technical",
        bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
    },
    {
        title: "Annual Cultural Festival",
        description: "Experience the vibrant diversity of our campus! Enjoy music, dance, food stalls, and cultural performances from students around the world.",
        date: new Date('2024-12-20'),
        time: "05:00 PM",
        venue: "Campus Green Lawn",
        category: "Cultural",
        bannerUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"
    },
    {
        title: "Inter-College Basketball Championship",
        description: "Cheer for your team in the most anticipated sports event of the year! Watch top college teams compete for the championship trophy.",
        date: new Date('2024-12-18'),
        time: "02:00 PM",
        venue: "Sports Complex Arena",
        category: "Sports",
        bannerUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800"
    },
    {
        title: "Career Fair 2024",
        description: "Meet recruiters from top companies! Explore internship and job opportunities, attend resume workshops, and network with industry professionals.",
        date: new Date('2024-12-22'),
        time: "10:00 AM",
        venue: "Convention Center",
        category: "Academic",
        bannerUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800"
    },
    {
        title: "Hackathon 2024: Code for Change",
        description: "48-hour coding marathon! Build innovative solutions to real-world problems. Prizes worth $10,000 and mentorship from tech leaders.",
        date: new Date('2024-12-28'),
        time: "06:00 PM",
        venue: "Computer Science Building, Lab 301",
        category: "Technical",
        bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
    },
    {
        title: "Environmental Awareness Workshop",
        description: "Learn about sustainability, climate change, and how you can make a difference. Interactive sessions on recycling, conservation, and green living.",
        date: new Date('2025-01-05'),
        time: "11:00 AM",
        venue: "Environmental Science Building",
        category: "Social",
        bannerUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
    },
    {
        title: "Stand-Up Comedy Night",
        description: "Get ready to laugh! Featuring popular comedians and student performers. A night of entertainment you won't want to miss!",
        date: new Date('2025-01-08'),
        time: "07:00 PM",
        venue: "Student Union Theater",
        category: "Cultural",
        bannerUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800"
    },
    {
        title: "Yoga and Wellness Session",
        description: "Start your day with mindfulness! Free yoga classes, meditation sessions, and wellness tips from certified instructors.",
        date: new Date('2025-01-10'),
        time: "06:30 AM",
        venue: "Fitness Center, Yoga Studio",
        category: "Sports",
        bannerUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"
    },
    {
        title: "Entrepreneurship Bootcamp",
        description: "Turn your ideas into reality! Learn from successful entrepreneurs, develop your business plan, and pitch to investors.",
        date: new Date('2025-01-12'),
        time: "09:00 AM",
        venue: "Business School Auditorium",
        category: "Academic",
        bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800"
    },
    {
        title: "Photography Exhibition: Campus Life",
        description: "Explore stunning photographs captured by talented student photographers. Showcasing the beauty and diversity of campus life.",
        date: new Date('2025-01-15'),
        time: "03:00 PM",
        venue: "Art Gallery, Fine Arts Building",
        category: "Cultural",
        bannerUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800"
    },
    {
        title: "AI & Machine Learning Workshop",
        description: "Hands-on workshop on building ML models. Learn Python, TensorFlow, and deploy your first AI application. Laptops required.",
        date: new Date('2025-01-18'),
        time: "01:00 PM",
        venue: "Tech Lab, Engineering Building",
        category: "Technical",
        bannerUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"
    },
    {
        title: "Blood Donation Drive",
        description: "Save lives! Participate in our annual blood donation camp. Every donation can save up to three lives. Refreshments provided.",
        date: new Date('2025-01-20'),
        time: "08:00 AM",
        venue: "Medical Center",
        category: "Social",
        bannerUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusevents', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // Find or create a default user to be the creator of events
        let defaultUser = await User.findOne({ email: 'admin@campusevents.com' });
        
        if (!defaultUser) {
            console.log('Creating default admin user...');
            defaultUser = new User({
                name: 'Campus Events Admin',
                email: 'admin@campusevents.com',
                passwordHash: 'admin123' // Will be hashed by pre-save hook
            });
            await defaultUser.save();
            console.log('Default admin user created');
        }

        // Clear existing events (optional - comment out if you want to keep existing events)
        console.log('Clearing existing events...');
        await Event.deleteMany({});

        // Create sample events
        console.log('Creating sample events...');
        const events = sampleEvents.map(event => ({
            ...event,
            createdBy: defaultUser._id
        }));

        await Event.insertMany(events);
        console.log(`✅ Successfully created ${events.length} sample events!`);

        // Display created events
        const createdEvents = await Event.find().populate('createdBy', 'name email');
        console.log('\n📅 Created Events:');
        createdEvents.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title} - ${event.category} - ${event.date.toDateString()}`);
        });

        console.log('\n✨ Database seeding completed successfully!');
        console.log('\n📝 Admin credentials:');
        console.log('   Email: admin@campusevents.com');
        console.log('   Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();

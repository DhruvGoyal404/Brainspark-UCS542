/**
 * OOPs & SYSTEM DESIGN QUIZZES SEED DATA
 * Contains Object-Oriented Programming and System Design quizzes
 * Run: node seeds/quizzes-oops.seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');

const oopsQuizzes = [
    // ===== OOPS FUNDAMENTALS - EASY =====
    {
        id: 'oops-concepts',
        title: 'OOPs Concepts',
        description: 'Object-Oriented Programming fundamentals',
        category: 'other',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 20,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What are the four pillars of OOPs?',
                options: [
                    { id: 'A', text: 'Encapsulation, Abstraction, Inheritance, Polymorphism', isCorrect: true },
                    { id: 'B', text: 'Variables, Functions, Classes, Objects', isCorrect: false },
                    { id: 'C', text: 'Loops, Conditions, Functions, Arrays', isCorrect: false },
                    { id: 'D', text: 'Input, Output, Process, Storage', isCorrect: false }
                ],
                explanation: 'The four pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is encapsulation?',
                options: [
                    { id: 'A', text: 'Hiding implementation details and bundling data with methods', isCorrect: true },
                    { id: 'B', text: 'Creating multiple objects', isCorrect: false },
                    { id: 'C', text: 'Inheriting from parent class', isCorrect: false },
                    { id: 'D', text: 'Having multiple forms', isCorrect: false }
                ],
                explanation: 'Encapsulation bundles data and methods together while hiding internal implementation details.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is inheritance?',
                options: [
                    { id: 'A', text: 'Hiding data', isCorrect: false },
                    { id: 'B', text: 'A class acquiring properties and methods from another class', isCorrect: true },
                    { id: 'C', text: 'Creating objects', isCorrect: false },
                    { id: 'D', text: 'Method overloading', isCorrect: false }
                ],
                explanation: 'Inheritance allows a class to inherit properties and methods from a parent class.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is polymorphism?',
                options: [
                    { id: 'A', text: 'Creating many classes', isCorrect: false },
                    { id: 'B', text: 'Ability of objects to take many forms', isCorrect: true },
                    { id: 'C', text: 'Hiding data', isCorrect: false },
                    { id: 'D', text: 'Creating objects', isCorrect: false }
                ],
                explanation: 'Polymorphism allows objects of different classes to be treated as objects of a common parent class.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is abstraction?',
                options: [
                    { id: 'A', text: 'Showing all details', isCorrect: false },
                    { id: 'B', text: 'Hiding complexity and showing only essential features', isCorrect: true },
                    { id: 'C', text: 'Creating abstract art', isCorrect: false },
                    { id: 'D', text: 'Multiple inheritance', isCorrect: false }
                ],
                explanation: 'Abstraction hides complex implementation and shows only necessary functionality.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a class?',
                options: [
                    { id: 'A', text: 'An instance of an object', isCorrect: false },
                    { id: 'B', text: 'A blueprint for creating objects', isCorrect: true },
                    { id: 'C', text: 'A function', isCorrect: false },
                    { id: 'D', text: 'A variable', isCorrect: false }
                ],
                explanation: 'A class is a blueprint or template for creating objects with specific properties and methods.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is an object?',
                options: [
                    { id: 'A', text: 'A blueprint', isCorrect: false },
                    { id: 'B', text: 'An instance of a class', isCorrect: true },
                    { id: 'C', text: 'A data type', isCorrect: false },
                    { id: 'D', text: 'A function', isCorrect: false }
                ],
                explanation: 'An object is an instance of a class with its own state and behavior.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is method overloading?',
                options: [
                    { id: 'A', text: 'Overwriting a method', isCorrect: false },
                    { id: 'B', text: 'Multiple methods with same name but different parameters', isCorrect: true },
                    { id: 'C', text: 'Inheriting methods', isCorrect: false },
                    { id: 'D', text: 'Hiding methods', isCorrect: false }
                ],
                explanation: 'Method overloading is compile-time polymorphism - same name, different parameter lists.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is method overriding?',
                options: [
                    { id: 'A', text: 'Multiple methods with same name', isCorrect: false },
                    { id: 'B', text: 'Child class redefining parent class method', isCorrect: true },
                    { id: 'C', text: 'Creating new methods', isCorrect: false },
                    { id: 'D', text: 'Deleting methods', isCorrect: false }
                ],
                explanation: 'Method overriding is runtime polymorphism - child class provides specific implementation.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a constructor?',
                options: [
                    { id: 'A', text: 'A method that destroys objects', isCorrect: false },
                    { id: 'B', text: 'A special method called when object is created', isCorrect: true },
                    { id: 'C', text: 'A static method', isCorrect: false },
                    { id: 'D', text: 'A private variable', isCorrect: false }
                ],
                explanation: 'Constructor is a special method automatically called when an object is instantiated.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between public, private, and protected?',
                options: [
                    { id: 'A', text: 'They are all the same', isCorrect: false },
                    { id: 'B', text: 'Access modifiers controlling visibility of members', isCorrect: true },
                    { id: 'C', text: 'Types of classes', isCorrect: false },
                    { id: 'D', text: 'Types of methods', isCorrect: false }
                ],
                explanation: 'Access modifiers: public (everywhere), private (same class), protected (same class + subclasses).',
                difficulty: 'easy'
            },
            {
                questionText: 'What is an abstract class?',
                options: [
                    { id: 'A', text: 'A class that can be instantiated', isCorrect: false },
                    { id: 'B', text: 'A class that cannot be instantiated and may have abstract methods', isCorrect: true },
                    { id: 'C', text: 'A class with no methods', isCorrect: false },
                    { id: 'D', text: 'A final class', isCorrect: false }
                ],
                explanation: 'Abstract class cannot be instantiated, serves as base class with possibly abstract methods.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is an interface?',
                options: [
                    { id: 'A', text: 'A type of class', isCorrect: false },
                    { id: 'B', text: 'A contract defining methods a class must implement', isCorrect: true },
                    { id: 'C', text: 'A user interface', isCorrect: false },
                    { id: 'D', text: 'A variable type', isCorrect: false }
                ],
                explanation: 'Interface defines a contract of methods that implementing classes must provide.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is composition in OOPs?',
                options: [
                    { id: 'A', text: 'A class contains objects of other classes', isCorrect: true },
                    { id: 'B', text: 'A type of inheritance', isCorrect: false },
                    { id: 'C', text: 'Music composition', isCorrect: false },
                    { id: 'D', text: 'Method overloading', isCorrect: false }
                ],
                explanation: 'Composition: a class contains objects of other classes (has-a relationship).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the difference between composition and inheritance?',
                options: [
                    { id: 'A', text: 'They are the same', isCorrect: false },
                    { id: 'B', text: 'Composition is has-a, inheritance is is-a relationship', isCorrect: true },
                    { id: 'C', text: 'Composition is faster', isCorrect: false },
                    { id: 'D', text: 'Inheritance is always better', isCorrect: false }
                ],
                explanation: 'Inheritance: is-a relationship (Dog is Animal). Composition: has-a (Car has Engine).',
                difficulty: 'medium'
            }
        ]
    },

    // ===== DESIGN PATTERNS - HARD =====
    {
        id: 'design-patterns',
        title: 'Design Patterns',
        description: 'Learn common software design patterns',
        category: 'other',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is the Singleton pattern?',
                options: [
                    { id: 'A', text: 'Creates multiple instances', isCorrect: false },
                    { id: 'B', text: 'Ensures only one instance of a class exists', isCorrect: true },
                    { id: 'C', text: 'Creates objects from factory', isCorrect: false },
                    { id: 'D', text: 'Observes object changes', isCorrect: false }
                ],
                explanation: 'Singleton ensures a class has only one instance and provides global access to it.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Factory pattern?',
                options: [
                    { id: 'A', text: 'Creates a single instance', isCorrect: false },
                    { id: 'B', text: 'Creates objects without specifying exact class', isCorrect: true },
                    { id: 'C', text: 'Observes changes', isCorrect: false },
                    { id: 'D', text: 'Decorates objects', isCorrect: false }
                ],
                explanation: 'Factory pattern creates objects without exposing instantiation logic to the client.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Observer pattern?',
                options: [
                    { id: 'A', text: 'Creates objects', isCorrect: false },
                    { id: 'B', text: 'Defines one-to-many dependency for state changes', isCorrect: true },
                    { id: 'C', text: 'Decorates objects', isCorrect: false },
                    { id: 'D', text: 'Creates single instance', isCorrect: false }
                ],
                explanation: 'Observer defines a subscription mechanism to notify objects about events.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the Decorator pattern?',
                options: [
                    { id: 'A', text: 'Creates new classes', isCorrect: false },
                    { id: 'B', text: 'Adds behavior to objects dynamically', isCorrect: true },
                    { id: 'C', text: 'Observes changes', isCorrect: false },
                    { id: 'D', text: 'Creates factories', isCorrect: false }
                ],
                explanation: 'Decorator attaches additional responsibilities to an object dynamically.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the Strategy pattern?',
                options: [
                    { id: 'A', text: 'A single algorithm', isCorrect: false },
                    { id: 'B', text: 'Defines family of algorithms, makes them interchangeable', isCorrect: true },
                    { id: 'C', text: 'Creates objects', isCorrect: false },
                    { id: 'D', text: 'Observes changes', isCorrect: false }
                ],
                explanation: 'Strategy pattern lets you select an algorithm at runtime from a family of algorithms.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the Adapter pattern?',
                options: [
                    { id: 'A', text: 'Creates new interfaces', isCorrect: false },
                    { id: 'B', text: 'Allows incompatible interfaces to work together', isCorrect: true },
                    { id: 'C', text: 'Decorates objects', isCorrect: false },
                    { id: 'D', text: 'Creates single instance', isCorrect: false }
                ],
                explanation: 'Adapter converts interface of a class into another interface clients expect.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Facade pattern?',
                options: [
                    { id: 'A', text: 'Exposes all methods', isCorrect: false },
                    { id: 'B', text: 'Provides simplified interface to complex subsystem', isCorrect: true },
                    { id: 'C', text: 'Creates objects', isCorrect: false },
                    { id: 'D', text: 'Observes changes', isCorrect: false }
                ],
                explanation: 'Facade provides a simplified interface to a complex system of classes.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is MVC pattern?',
                options: [
                    { id: 'A', text: 'Model-View-Controller', isCorrect: true },
                    { id: 'B', text: 'Multiple View Controller', isCorrect: false },
                    { id: 'C', text: 'Model-Variable-Class', isCorrect: false },
                    { id: 'D', text: 'Main View Component', isCorrect: false }
                ],
                explanation: 'MVC separates application into Model (data), View (UI), Controller (logic).',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the Builder pattern?',
                options: [
                    { id: 'A', text: 'Builds one object quickly', isCorrect: false },
                    { id: 'B', text: 'Separates construction of complex object from its representation', isCorrect: true },
                    { id: 'C', text: 'Destroys objects', isCorrect: false },
                    { id: 'D', text: 'Clones objects', isCorrect: false }
                ],
                explanation: 'Builder constructs complex objects step by step, allowing different representations.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the Prototype pattern?',
                options: [
                    { id: 'A', text: 'Creates first version of object', isCorrect: false },
                    { id: 'B', text: 'Creates new objects by cloning existing ones', isCorrect: true },
                    { id: 'C', text: 'Observes objects', isCorrect: false },
                    { id: 'D', text: 'Decorates objects', isCorrect: false }
                ],
                explanation: 'Prototype creates new objects by copying an existing object (cloning).',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the Command pattern?',
                options: [
                    { id: 'A', text: 'Direct method calls', isCorrect: false },
                    { id: 'B', text: 'Encapsulates request as an object', isCorrect: true },
                    { id: 'C', text: 'Creates objects', isCorrect: false },
                    { id: 'D', text: 'Observes changes', isCorrect: false }
                ],
                explanation: 'Command encapsulates a request as an object, allowing parameterization and queuing.',
                difficulty: 'hard'
            },
            {
                questionText: 'What are SOLID principles?',
                options: [
                    { id: 'A', text: 'Hardware principles', isCorrect: false },
                    { id: 'B', text: 'Five principles for maintainable OOP design', isCorrect: true },
                    { id: 'C', text: 'Database principles', isCorrect: false },
                    { id: 'D', text: 'Network protocols', isCorrect: false }
                ],
                explanation: 'SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
                difficulty: 'medium'
            }
        ]
    },

    // ===== SYSTEM DESIGN - HARD =====
    {
        id: 'system-design',
        title: 'System Design Basics',
        description: 'Learn system design fundamentals and scalability',
        category: 'other',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What is horizontal scaling?',
                options: [
                    { id: 'A', text: 'Adding more power to existing machine', isCorrect: false },
                    { id: 'B', text: 'Adding more machines to distribute load', isCorrect: true },
                    { id: 'C', text: 'Reducing servers', isCorrect: false },
                    { id: 'D', text: 'Adding more memory', isCorrect: false }
                ],
                explanation: 'Horizontal scaling (scale out) adds more machines to handle increased load.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is vertical scaling?',
                options: [
                    { id: 'A', text: 'Adding more machines', isCorrect: false },
                    { id: 'B', text: 'Adding more power/resources to existing machine', isCorrect: true },
                    { id: 'C', text: 'Removing servers', isCorrect: false },
                    { id: 'D', text: 'Distributing load', isCorrect: false }
                ],
                explanation: 'Vertical scaling (scale up) adds more CPU, RAM, or storage to existing machine.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a load balancer?',
                options: [
                    { id: 'A', text: 'A database', isCorrect: false },
                    { id: 'B', text: 'Distributes incoming traffic across multiple servers', isCorrect: true },
                    { id: 'C', text: 'A type of cache', isCorrect: false },
                    { id: 'D', text: 'A backup server', isCorrect: false }
                ],
                explanation: 'Load balancer distributes network traffic across multiple servers for reliability and performance.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is caching?',
                options: [
                    { id: 'A', text: 'Deleting old data', isCorrect: false },
                    { id: 'B', text: 'Storing frequently accessed data for quick retrieval', isCorrect: true },
                    { id: 'C', text: 'Encrypting data', isCorrect: false },
                    { id: 'D', text: 'Backing up data', isCorrect: false }
                ],
                explanation: 'Caching stores frequently accessed data in fast storage for quick retrieval.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a CDN?',
                options: [
                    { id: 'A', text: 'Central Data Network', isCorrect: false },
                    { id: 'B', text: 'Content Delivery Network', isCorrect: true },
                    { id: 'C', text: 'Computer Data Node', isCorrect: false },
                    { id: 'D', text: 'Cached Data Network', isCorrect: false }
                ],
                explanation: 'CDN is a geographically distributed network of servers delivering content from nearest location.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is database replication?',
                options: [
                    { id: 'A', text: 'Deleting databases', isCorrect: false },
                    { id: 'B', text: 'Copying data across multiple database servers', isCorrect: true },
                    { id: 'C', text: 'Compressing databases', isCorrect: false },
                    { id: 'D', text: 'Encrypting databases', isCorrect: false }
                ],
                explanation: 'Replication copies data across multiple servers for redundancy and read scalability.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the CAP theorem?',
                options: [
                    { id: 'A', text: 'A coding standard', isCorrect: false },
                    { id: 'B', text: 'Consistency, Availability, Partition tolerance trade-off', isCorrect: true },
                    { id: 'C', text: 'A security protocol', isCorrect: false },
                    { id: 'D', text: 'A design pattern', isCorrect: false }
                ],
                explanation: 'CAP: distributed systems can only guarantee 2 of 3: Consistency, Availability, Partition tolerance.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is a message queue?',
                options: [
                    { id: 'A', text: 'Email system', isCorrect: false },
                    { id: 'B', text: 'Asynchronous communication between services', isCorrect: true },
                    { id: 'C', text: 'A database', isCorrect: false },
                    { id: 'D', text: 'A web server', isCorrect: false }
                ],
                explanation: 'Message queue enables asynchronous communication between services (Kafka, RabbitMQ).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is microservices architecture?',
                options: [
                    { id: 'A', text: 'Very small applications', isCorrect: false },
                    { id: 'B', text: 'Breaking application into small, independent services', isCorrect: true },
                    { id: 'C', text: 'Using microprocessors', isCorrect: false },
                    { id: 'D', text: 'A type of database', isCorrect: false }
                ],
                explanation: 'Microservices architecture structures application as collection of loosely coupled services.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is eventual consistency?',
                options: [
                    { id: 'A', text: 'Immediate consistency', isCorrect: false },
                    { id: 'B', text: 'System becomes consistent over time after updates', isCorrect: true },
                    { id: 'C', text: 'Never consistent', isCorrect: false },
                    { id: 'D', text: 'Partial consistency', isCorrect: false }
                ],
                explanation: 'Eventual consistency: given enough time, all replicas will converge to same value.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is rate limiting?',
                options: [
                    { id: 'A', text: 'Limiting database size', isCorrect: false },
                    { id: 'B', text: 'Limiting number of requests a user can make', isCorrect: true },
                    { id: 'C', text: 'Limiting server memory', isCorrect: false },
                    { id: 'D', text: 'Limiting file uploads', isCorrect: false }
                ],
                explanation: 'Rate limiting controls the number of requests a client can make in a time period.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is an API Gateway?',
                options: [
                    { id: 'A', text: 'A database', isCorrect: false },
                    { id: 'B', text: 'Single entry point for all client requests to microservices', isCorrect: true },
                    { id: 'C', text: 'A firewall', isCorrect: false },
                    { id: 'D', text: 'A load balancer only', isCorrect: false }
                ],
                explanation: 'API Gateway is the single entry point handling routing, authentication, rate limiting.',
                difficulty: 'medium'
            }
        ]
    }
];

const seedOOPsQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = await User.create({
                username: 'admin',
                email: 'admin@brainspark.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        // Delete existing quizzes in 'other' category
        await Quiz.deleteMany({ category: 'other' });
        console.log('🗑️  Cleared existing OOPs/System Design quizzes');

        const quizzesWithCreator = oopsQuizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        const totalQuestions = oopsQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        console.log(`✅ Seeded ${oopsQuizzes.length} OOPs/System Design quizzes with ${totalQuestions} total questions!`);
        console.log('\n📊 OOPs/System Design Quiz Summary:');
        oopsQuizzes.forEach(quiz => {
            console.log(`   - ${quiz.title}: ${quiz.questions.length} questions (${quiz.difficulty})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding OOPs quizzes:', error);
        process.exit(1);
    }
};

seedOOPsQuizzes();

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Mail, Phone, Linkedin, Github, Twitter, ExternalLink, 
    GraduationCap, Briefcase, Code, Award, Users, Calendar,
    LayoutGrid, List
} from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
    const [skillsView, setSkillsView] = useState('card'); // 'card' or 'list'

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const socialLinks = [
        { icon: <Mail size={20} />, label: 'Email', href: 'mailto:dhruv621999goyal@gmail.com', text: 'dhruv621999goyal@gmail.com' },
        { icon: <Phone size={20} />, label: 'Phone', href: 'tel:+918858880050', text: '+91 8858880050' },
        { icon: <Linkedin size={20} />, label: 'LinkedIn', href: 'https://linkedin.com/in/DhruvGoyalThapar', text: 'LinkedIn' },
        { icon: <Github size={20} />, label: 'GitHub', href: 'https://github.com/DhruvGoyal404', text: 'GitHub' },
        { icon: <Code size={20} />, label: 'LeetCode', href: 'https://leetcode.com/u/agent_dg/', text: 'LeetCode' },
        { icon: <Twitter size={20} />, label: 'X', href: 'https://x.com/agent__dg', text: 'X' },
        { icon: <ExternalLink size={20} />, label: 'Linktree', href: 'https://linktr.ee/DhruvGoyal404', text: 'Linktree' },
        { icon: <ExternalLink size={20} />, label: 'Portfolio', href: 'https://dhruvgoyal.tech', text: 'Portfolio' },
        { icon: <ExternalLink size={20} />, label: 'DSA Portfolio', href: 'https://dsa.dhruvgoyal.tech', text: 'DSA Portfolio' },
    ];

    const education = [
        {
            institution: 'Thapar Institute of Engineering & Technology',
            location: 'Patiala, Punjab, India',
            degree: 'Bachelor of Technology in Computer Engineering',
            grade: 'CGPA: 9.16/10',
            duration: 'Aug 2023 – Aug 2027',
            highlights: [
                'Awarded Merit Scholarship worth INR 7+ Lakhs for exceptional academic performance.',
                'Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Web Development, Machine Learning, Artificial Intelligence, Database Management Systems, Operating Systems, Software Engineering, Image Processing, UI/UX Design, Computer Architecture and Organization, Computer Networks.'
            ]
        },
        {
            institution: 'Modern Academy',
            location: 'Lucknow, Uttar Pradesh, India',
            degree: 'ISC Intermediate PCM with Computer Science',
            grade: '94.5%',
            duration: 'Apr 2021 – Mar 2023',
            highlights: []
        }
    ];

    const experience = [
        {
            company: 'Amazon',
            role: 'Apprentice - Amazon ML Summer School',
            type: 'Trainee',
            location: 'Remote',
            duration: 'Aug 2025 – Sept 2025',
            highlights: [
                'Selected from 60,000+ nationwide applicants for Amazon ML Summer School (top 5%).',
                'Completed 8 comprehensive modules including Deep Learning, NLP, and Generative AI across 20 hours.',
                'Gained hands-on expertise in 5+ production-level ML algorithms and systems serving enterprise-scale applications.'
            ]
        },
        {
            company: 'Rebec Technologies Pvt. Ltd.',
            role: 'Summer SDE Intern',
            type: 'Internship',
            location: 'Mohali, Punjab, India',
            duration: 'Jun 2025 – Aug 2025',
            highlights: [
                'Engineered core features for Kompte platform serving 5000+ daily users and 1000+ transactions.',
                'Deployed Cashfree Payment Gateway and implemented CI/CD pipelines across 3+ scalable products.',
                'Spearheaded 30+ component integrations using Next.js, Node.js, and MongoDB across 20+ optimized tables.'
            ]
        }
    ];

    const skills = {
        'Programming Languages': ['C', 'C++', 'Java', 'GoLang', 'Python', 'HTML', 'CSS', 'JavaScript'],
        'Databases': ['Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'Redis'],
        'Frameworks': ['React', 'Next.js', 'Express', 'Node.js', 'Tailwind CSS', 'TypeScript'],
        'Cloud/DevOps': ['Azure', 'Cloudinary', 'Cloudflare', 'Docker', 'Vercel', 'Netlify', 'Google Colab'],
        'Libraries': ['NumPy', 'Pandas', 'Matplotlib', 'TensorFlow', 'Scikit-Learn', 'OpenCV'],
        'Developer Tools': ['Postman', 'VS Code', 'Git', 'GitHub', 'Jupyter', 'Figma'],
        'CS Fundamentals': ['OS', 'DBMS', 'OOPS', 'CN', 'DSA', 'System Design']
    };

    const projects = [
        {
            name: 'Bridge Between Patients & Hospitals - Arogyam',
            tech: 'Vite, Firebase, Node.js, React, Express.js',
            date: 'Jan 2025',
            highlights: [
                'Developed secure hospital management system handling 1000+ patient records with multi-layer authentication.',
                'Designed scalable RESTful APIs, efficient admin interface, reducing response time by 25% for faster data retrieval.',
                'Achieved 85+ performance and 90+ SEO on Google Lighthouse via best code splitting practices & lazy loading.'
            ]
        },
        {
            name: 'Image Processing Platform - GoSnap',
            tech: 'JavaScript, React, TailwindCSS, Express.js, Sharp.js',
            date: 'Jun 2024',
            highlights: [
                'Crafted comprehensive web application for advanced image processing focusing on 10+ core performance metrics.',
                'Enhanced server-side transformations using SharpJS for 5+ image formats with automated processing workflows.',
                'Scored 95+ accessibility on Google Lighthouse through semantic HTML, ARIA labels, and optimized asset delivery.'
            ]
        }
    ];

    const responsibilities = [
        {
            organization: 'Creative Computing Society, TIET',
            role: 'Core Member',
            location: 'Patiala, Punjab, India',
            duration: 'Oct 2023 – Apr 2025',
            highlights: [
                'Led organization of 3+ technical events attracting 1000+ participants across vast development domains.',
                'Coordinated 50+ member teams to draft & facilitate technical challenges for many competitive programming events.',
                'Orchestrated HackTU 6.0 MLH Hackathon, seamlessly bringing together 200+ teams nationwide.',
                'Mentored and guided 1500+ students through hands-on DSA bootcamps, sessions and technical workshops.'
            ]
        }
    ];

    const achievements = [
        'Amazon ML Summer School | Acknowledgement Letter',
        'Rebec Technologies Pvt. Ltd. | SDE Internship Completion Certificate | Letter of Recommendation (Aug 2025)',
        'SatHack Hackathon - Finalist (Nov 2024)',
        'Data Structures and Algorithms Course by Coding Blocks | Certificate (Dec 2023)'
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <main className="about-page">
            <div className="about-container container">
                {/* Hero Section */}
                <motion.section 
                    className="about-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <div className="hero-image-wrapper">
                        <img 
                            src="/dhruv.jpeg" 
                            alt="Dhruv Goyal" 
                            className="profile-image"
                        />
                        <div className="image-glow"></div>
                    </div>
                    <div className="hero-info">
                        <h1 className="hero-name">Dhruv Goyal</h1>
                        <p className="hero-tagline">Full Stack Developer | ML Enthusiast | Problem Solver</p>
                        <div className="social-links-grid">
                            {socialLinks.map((link, index) => (
                                <a 
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link-item"
                                    aria-label={link.label}
                                >
                                    {link.icon}
                                    <span>{link.text}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Education Section */}
                <motion.section 
                    className="about-section"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <GraduationCap size={28} className="section-icon" />
                        <h2>Education</h2>
                    </motion.div>
                    <div className="cards-grid">
                        {education.map((edu, index) => (
                            <motion.article key={index} className="info-card" variants={itemVariants}>
                                <div className="card-header">
                                    <h3>{edu.institution}</h3>
                                    <span className="location">{edu.location}</span>
                                </div>
                                <div className="card-meta">
                                    <span className="degree">{edu.degree}</span>
                                    <span className="grade">{edu.grade}</span>
                                </div>
                                <span className="duration">
                                    <Calendar size={14} /> {edu.duration}
                                </span>
                                {edu.highlights.length > 0 && (
                                    <ul className="highlights-list">
                                        {edu.highlights.map((highlight, idx) => (
                                            <li key={idx}>{highlight}</li>
                                        ))}
                                    </ul>
                                )}
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                {/* Experience Section */}
                <motion.section 
                    className="about-section"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <Briefcase size={28} className="section-icon" />
                        <h2>Experience</h2>
                    </motion.div>
                    <div className="cards-grid">
                        {experience.map((exp, index) => (
                            <motion.article key={index} className="info-card experience-card" variants={itemVariants}>
                                <div className="card-header">
                                    <h3>{exp.company}</h3>
                                    <span className="badge">{exp.type}</span>
                                </div>
                                <div className="card-meta">
                                    <span className="role">{exp.role}</span>
                                    <span className="location">{exp.location}</span>
                                </div>
                                <span className="duration">
                                    <Calendar size={14} /> {exp.duration}
                                </span>
                                <ul className="highlights-list">
                                    {exp.highlights.map((highlight, idx) => (
                                        <li key={idx}>{highlight}</li>
                                    ))}
                                </ul>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                {/* Technical Skills Section */}
                <motion.section 
                    className="about-section"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <Code size={28} className="section-icon" />
                        <h2>Technical Skills</h2>
                        <div className="view-toggle">
                            <button 
                                className={`toggle-btn ${skillsView === 'card' ? 'active' : ''}`}
                                onClick={() => setSkillsView('card')}
                                aria-label="Card view"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                className={`toggle-btn ${skillsView === 'list' ? 'active' : ''}`}
                                onClick={() => setSkillsView('list')}
                                aria-label="List view"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </motion.div>
                    
                    {skillsView === 'card' ? (
                        <motion.div className="skills-grid" variants={itemVariants}>
                            {Object.entries(skills).map(([category, skillList], index) => (
                                <div key={index} className="skill-category">
                                    <h4>{category}</h4>
                                    <div className="skill-tags">
                                        {skillList.map((skill, idx) => (
                                            <span key={idx} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div className="skills-list-view" variants={itemVariants}>
                            {Object.entries(skills).map(([category, skillList], index) => (
                                <div key={index} className="skill-list-category">
                                    <h4>{category}</h4>
                                    <ul className="skill-list">
                                        {skillList.map((skill, idx) => (
                                            <li key={idx}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </motion.section>

                {/* Projects Section */}
                <motion.section 
                    className="about-section"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <Code size={28} className="section-icon" />
                        <h2>Projects</h2>
                    </motion.div>
                    <div className="cards-grid">
                        {projects.map((project, index) => (
                            <motion.article key={index} className="info-card project-card" variants={itemVariants}>
                                <div className="card-header">
                                    <h3>{project.name}</h3>
                                    <span className="date">{project.date}</span>
                                </div>
                                <div className="tech-stack">
                                    {project.tech.split(', ').map((tech, idx) => (
                                        <span key={idx} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                                <ul className="highlights-list">
                                    {project.highlights.map((highlight, idx) => (
                                        <li key={idx}>{highlight}</li>
                                    ))}
                                </ul>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                {/* Positions of Responsibility Section */}
                <motion.section 
                    className="about-section"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <Users size={28} className="section-icon" />
                        <h2>Positions of Responsibility</h2>
                    </motion.div>
                    <div className="cards-grid">
                        {responsibilities.map((resp, index) => (
                            <motion.article key={index} className="info-card" variants={itemVariants}>
                                <div className="card-header">
                                    <h3>{resp.organization}</h3>
                                    <span className="role">{resp.role}</span>
                                </div>
                                <div className="card-meta">
                                    <span className="location">{resp.location}</span>
                                </div>
                                <span className="duration">
                                    <Calendar size={14} /> {resp.duration}
                                </span>
                                <ul className="highlights-list">
                                    {resp.highlights.map((highlight, idx) => (
                                        <li key={idx}>{highlight}</li>
                                    ))}
                                </ul>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                {/* Achievements & Certifications Section */}
                <motion.section 
                    className="about-section"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <Award size={28} className="section-icon" />
                        <h2>Hackathons, Achievements & Certifications</h2>
                    </motion.div>
                    <motion.div className="achievements-grid" variants={itemVariants}>
                        {achievements.map((achievement, index) => (
                            <div key={index} className="achievement-item">
                                <Award size={18} className="achievement-icon" />
                                <span>{achievement}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.section>
            </div>
        </main>
    );
};

export default AboutPage;

"use client"

import { Shield, Eye, Brain, CheckCircle, Target, Zap, Users, Award, TrendingUp, Lock, Sparkles, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ThreeDCarousel, TeamMember } from "@/components/ui/three-d-carousel"

export function AboutSectionRedesigned() {
    const teamMembers: TeamMember[] = [
        {
            id: 1,
            name: "Rajesh Kumar",
            role: "Project Lead & Full Stack Architect",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
            isLeader: true,
            bio: "10+ years in EdTech, specializing in secure platforms and scalable architecture. Leading the team with expertise in full-stack development and a passion for creating innovative EdTech solutions."
        },
        {
            id: 2,
            name: "Priya Sharma",
            role: "Frontend Developer",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
            bio: "React & Next.js expert with a strong focus on user experience and modern web technologies. Passionate about creating intuitive and performant interfaces."
        },
        {
            id: 3,
            name: "Arjun Patel",
            role: "Backend Developer",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
            bio: "Scalable systems & API architecture specialist with expertise in building robust backend solutions. Focused on performance and security."
        },
        {
            id: 4,
            name: "Sneha Reddy",
            role: "UI/UX Designer",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
            bio: "Human-centered design advocate creating beautiful and accessible user experiences. Bridging the gap between design and development."
        },
        {
            id: 5,
            name: "Vikram Singh",
            role: "AI/ML Engineer",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
            bio: "Computer vision & behavioral analysis expert specializing in AI-powered proctoring solutions. Pushing the boundaries of machine learning."
        },
    ]

    const stats = [
        { value: "99.9%", label: "Uptime Reliability", icon: TrendingUp },
        { value: "50K+", label: "Exams Monitored", icon: Users },
        { value: "24/7", label: "Support Available", icon: Shield },
        { value: "100%", label: "Data Encrypted", icon: Lock },
    ]

    const features = [
        {
            icon: Eye,
            title: "Real-Time Monitoring",
            description: "Advanced webcam surveillance with AI-powered face detection and attention tracking for continuous exam integrity."
        },
        {
            icon: Shield,
            title: "Screen Protection",
            description: "Comprehensive screen recording with instant detection of tab switching, window changes, and unauthorized applications."
        },
        {
            icon: Brain,
            title: "AI Analysis",
            description: "Machine learning algorithms that identify suspicious patterns, behavior anomalies, and potential cheating attempts."
        },
        {
            icon: Lock,
            title: "Secure Infrastructure",
            description: "Enterprise-grade encryption, secure data storage, and compliance with international privacy standards."
        },
        {
            icon: Zap,
            title: "Instant Alerts",
            description: "Real-time notifications for proctors when suspicious activities are detected during examinations."
        },
        {
            icon: Award,
            title: "Detailed Reports",
            description: "Comprehensive post-exam analytics with violation logs, timestamps, and evidence for review."
        },
    ]

    return (
        <section className="bg-gradient-to-b from-white via-blue-50/30 to-white">
            {/* Hero Section */}
            <div className="relative py-20 md:py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Securing the Future of
                            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                Online Education
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
                            Building trust in remote examinations through cutting-edge AI technology,
                            real-time monitoring, and unwavering commitment to academic integrity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 px-6 bg-gradient-to-r from-blue-600 to-cyan-500">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div key={index} className="text-center">
                                    <Icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                    <div className="text-sm md:text-base text-white/90 font-medium">{stat.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 md:py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge className="mb-4 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700">
                                Our Mission
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                Solving the Challenge of
                                <span className="block text-blue-600">Remote Exam Integrity</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                In today's digital-first education landscape, maintaining examination integrity has become
                                increasingly complex. Traditional proctoring methods fall short—they're either too invasive,
                                ineffective, or simply don't scale.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                Our platform bridges this gap with an intelligent, comprehensive solution that combines
                                real-time monitoring, AI-powered detection, and seamless user experience to ensure
                                fair and secure online examinations.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="outline" className="px-4 py-2 text-sm">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    AI-Powered
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    Real-Time Monitoring
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    Privacy-Focused
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {features.slice(0, 3).map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700">
                            Platform Features
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Comprehensive Exam Security
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Everything you need to conduct secure, fair, and reliable online examinations
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mb-6">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-20 md:py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700">
                            Our Core Values
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            What Drives Us Forward
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Principles that guide every decision and shape our platform
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-10 text-center hover:shadow-xl transition-all duration-300 border-2">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Security First</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Enterprise-grade protection with end-to-end encryption, ensuring every examination
                                is conducted in a secure environment.
                            </p>
                        </Card>
                        <Card className="p-10 text-center hover:shadow-xl transition-all duration-300 border-2">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                                <Eye className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Transparency</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Clear monitoring processes that respect privacy while maintaining academic honesty
                                and fairness for all participants.
                            </p>
                        </Card>
                        <Card className="p-10 text-center hover:shadow-xl transition-all duration-300 border-2">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Innovation</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Leveraging cutting-edge AI and machine learning to stay ahead of evolving
                                challenges in online examination security.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Team Section - 3D Carousel */}
            <div className="py-20 md:py-32 px-6 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700">
                            Our Team
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Meet the Minds Behind the Platform
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            A passionate team of engineers, designers, and innovators dedicated to
                            transforming online education
                        </p>
                    </div>

                    {/* 3D Carousel */}
                    <ThreeDCarousel 
                        members={teamMembers}
                        autoRotate={true}
                        rotateInterval={5000}
                        cardHeight={500}
                    />

                    {/* Team Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">5</div>
                            <div className="text-sm text-slate-600 font-semibold">Team Members</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">15+</div>
                            <div className="text-sm text-slate-600 font-semibold">Years Combined</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">100%</div>
                            <div className="text-sm text-slate-600 font-semibold">Dedicated</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">24/7</div>
                            <div className="text-sm text-slate-600 font-semibold">Committed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 md:py-32 px-6">
                <div className="container mx-auto max-w-5xl">
                    <Card className="p-12 md:p-16 text-center bg-gradient-to-r from-blue-600 to-cyan-500 border-0">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Ready to Transform Your Online Exams?
                        </h2>
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8">
                            Join thousands of institutions worldwide in delivering secure, fair, and
                            reliable online examinations with our platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                                Get Started Today
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-4 bg-white/10 text-white border-2 border-white rounded-lg font-semibold hover:bg-white/20 transition-all">
                                Schedule a Demo
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}

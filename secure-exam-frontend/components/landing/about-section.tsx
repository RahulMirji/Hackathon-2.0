"use client"

import { Shield, Eye, Brain, CheckCircle, Target, Zap } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
    const teamMembers = [
        {
            name: "Rajesh Kumar",
            role: "Project Lead & Full Stack Architect",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
            isLeader: true,
        },
        {
            name: "Priya Sharma",
            role: "Frontend Developer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        },
        {
            name: "Arjun Patel",
            role: "Backend Developer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        },
        {
            name: "Sneha Reddy",
            role: "UI/UX Designer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        },
        {
            name: "Vikram Singh",
            role: "AI/ML Engineer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        },
    ]

    return (
        <section className="bg-gradient-to-br from-blue-50/30 via-slate-50 to-blue-50/30">
            {/* Hero Section */}
            <div className="py-24 px-6">
                <div className="container mx-auto max-w-6xl text-center">
                    <p className="text-base md:text-lg text-slate-900 font-medium mb-8">
                        About Our Team
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-slate-900">
                        We're on a mission to secure
                        <br />
                        <span className="text-slate-300">
                            online education integrity
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                        Building the future of secure online examinations through advanced AI-powered proctoring
                        and real-time monitoring technology.
                    </p>
                </div>
            </div>

            {/* Problem Statement Section */}
            <div className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <p className="text-base md:text-lg text-slate-900 font-medium mb-6">
                                Our Mission
                            </p>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
                                The Challenge We're Solving
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-6">
                                In the era of remote learning, maintaining examination integrity has become increasingly challenging.
                                Traditional proctoring methods are either too invasive or ineffective, leaving institutions vulnerable
                                to academic dishonesty.
                            </p>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                                Our <span className="text-slate-900 font-semibold">Secure Online Examination Platform</span> addresses
                                this critical gap by combining real-time monitoring, AI-powered suspicious activity detection, and
                                comprehensive identity verification into a seamless, user-friendly experience.
                            </p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-2 text-slate-900">Webcam Monitoring</h4>
                                        <p className="text-slate-600">
                                            Continuous video surveillance with advanced face detection and attention tracking
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-2 text-slate-900">Screen Tracking</h4>
                                        <p className="text-slate-600">
                                            Real-time screen recording with tab switching and window change detection
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-2 text-slate-900">AI-Powered Analysis</h4>
                                        <p className="text-slate-600">
                                            Smart algorithms detecting suspicious patterns and behavior anomalies
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <p className="text-base md:text-lg text-slate-900 font-medium mb-6">
                            Our Core Values
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
                            What Drives Us
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                            Our core values guide every decision we make
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mb-6 shadow-xl">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Security First</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We prioritize the integrity and security of every examination with enterprise-grade
                                protection and encryption.
                            </p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mb-6 shadow-xl">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Transparency</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Clear monitoring processes that respect privacy while ensuring academic honesty
                                and fairness.
                            </p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mb-6 shadow-xl">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Innovation</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Leveraging cutting-edge AI and ML technologies to stay ahead of evolving
                                cheating methods.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <p className="text-base md:text-lg text-slate-900 font-medium mb-6">
                            The People Behind It
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
                            Meet Our Team
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            A dedicated group of engineers and designers passionate about education technology
                            and academic integrity
                        </p>
                    </div>

                    {/* Team Leader - Featured */}
                    <div className="mb-20">
                        <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-200 shadow-xl text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-2xl">
                                    <Image
                                        src={teamMembers[0].image}
                                        alt={teamMembers[0].name}
                                        width={160}
                                        height={160}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl whitespace-nowrap">
                                    Team Leader
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold mb-2 text-slate-900">{teamMembers[0].name}</h3>
                            <p className="text-xl text-slate-600 font-semibold mb-4">{teamMembers[0].role}</p>
                            <p className="text-slate-600 max-w-lg mx-auto">
                                Leading the team with expertise in full-stack development and a passion for
                                creating secure, scalable EdTech solutions.
                            </p>
                        </div>
                    </div>

                    {/* Other Team Members */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {teamMembers.slice(1).map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-2xl overflow-hidden border-4 border-slate-200 group-hover:border-slate-900 transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:scale-105">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            width={160}
                                            height={160}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>
                                <h4 className="font-bold text-lg md:text-xl mb-2 text-slate-900">{member.name}</h4>
                                <p className="text-sm md:text-base text-slate-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <p className="text-base md:text-lg text-slate-900 font-medium mb-6">
                        Join Our Mission
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
                        Transforming Online Education Together
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
                        We're committed to making online examinations secure, fair, and accessible for everyone.
                        Join us in building the future of academic integrity.
                    </p>
                </div>
            </div>
        </section>
    )
}

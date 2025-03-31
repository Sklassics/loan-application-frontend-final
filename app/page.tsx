"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, GraduationCap, Users, CheckCircle2, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import HOMEFAQ from "./home-faq/page"

export default function Home() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    // Get form values
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLInputElement).value;

    // Construct the Gmail URL with pre-filled data
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=dineshshanigarapu33@gmail.com&su=Message from ${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`)}`;

    // Redirect the user to the Gmail compose URL
    window.open(gmailUrl, "_blank");
  }
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState({
    hero: false,
    services: false,
    about: false,
    faq: false,
    contact: false,
  })
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    // Set hero to visible immediately for initial animation
    setIsVisible(prev => ({ ...prev, hero: true }))
    
    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(prev => ({ ...prev, [key]: true }))
            }
          },
          { threshold: 0.1 }
        )
        
        observer.observe(ref.current)
        observers.push(observer)
      }
    })
    
    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, []) // Empty dependency array to ensure this only runs once

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index)
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden ">
      <header className="border-b sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <motion.img
                src="/sklassics.png" 
                alt="Logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-130 h-10"
              />

          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#services" className="text-sm font-medium hover:text-violet-600 transition-colors duration-200 relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-violet-600 transition-colors duration-200 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-violet-600 transition-colors duration-200 relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-violet-600 transition-colors duration-200 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
            <div className="relative inline-block group animate-fadeIn opacity-100 transition-opacity duration-700">
      <button className="relative z-10 px-3 py-2 rounded-md text-white font-semibold overflow-hidden border bg-violet-150 bg-opacity-100 transition-all duration-300">
       Login
        <span className="absolute bottom-0 left-[-10%] w-0 h-[120%] bg-[#1ea664] skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
        <span className="absolute bottom-0 right-[-10%] w-0 h-[120%] border-[#1ea664] bg-[#1ea664] skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
      </button>
    </div>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button className="relative overflow-hidden group bg-violet-150">
                <span className="relative z-10">Register</span>
                <span className="absolute inset-0 bg-white/20 transform translate-y-full  group-hover:translate-y-0 transition-transform duration-300"></span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section ref={sectionRefs.hero} className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50"></div>
            <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-pink-300/20 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div> 
            <svg className="absolute bottom-0 left-0 right-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <div className="absolute top-10 right-0 transform -translate-x-1/2 -translate-y-1/2 animate-spin-very-slow">
        <svg
          width="30"
          height="200"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
        >
          <rect x="45" y="10" width="10" height="80" fill="lime" />
          <rect x="10" y="45" width="80" height="10" fill="lime" />
        </svg>
      </div>
      <div className="absolute top-[30px] left-[150px] opacity-30 animate-in ">
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="20" fill="orange" />
       
        </svg>
      </div>
          </div>
        
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                {isVisible.hero && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      className="space-y-2"
                    >
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
                      Quick & Easy Loans for Everyone
                      </h1>
                      <p className="max-w-[600px] text-slate-600 md:text-xl">
                        Get instant loans with minimal documentation. Apply online and receive funds within 24 hours.
                      </p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="flex flex-col gap-2 min-[400px]:flex-row"
                    >
                      <Link href="/login">
                        <Button size="lg" className="gap-1.5  from-violet-150 to-violet-150 transition-all duration-300 shadow-lg hover:shadow-violet-500/30">
                          Apply Now 
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </Button>
                      </Link>
                      <Link href="#services">
                        <Button size="lg" variant="outline" className="from-violet-150 to-violet-150  transition-all duration-300">
                          Learn More
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="flex items-center gap-4 mt-6"
                    >
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-violet-600">2,500+</span> customers trust us
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center">
                {isVisible.hero && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative w-full max-w-[550px] aspect-square"
                    style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src="/assets/note.gif"
                        alt="Hero Image"
                        width={550}
                        height={550}
                        className="rounded-2xl object-cover shadow-2xl"
                        style={{ transform: "translateZ(20px)" }}
                      />
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg"
                        style={{ transform: "translateZ(40px) rotate(3deg)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Instant Approval</p>
                            <p className="text-xs text-slate-500">Get approved in minutes</p>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="absolute -top-6 -left-6 bg-white rounded-xl p-4 shadow-lg"
                        style={{ transform: "translateZ(40px) rotate(-3deg)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">5-Star Service</p>
                            <p className="text-xs text-slate-500">Trusted by thousands</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="relative h-24 bg-gradient-to-b from-white to-indigo-50">
          <svg className="absolute bottom-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#eef2ff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Services Section */}
        <section id="services" ref={sectionRefs.services} className="w-full py-5 bg-indigo-50 relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            {isVisible.services && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                <div className="inline-block rounded-full text-green-500 px-3 py-1 text-sm font-medium  mb-4">
                  Our Services
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-gray-700">Tailored Loan Solutions</h2>
                  <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We offer customized loan options designed to meet your specific financial needs
                  </p>
                </div>
              </motion.div>
            )}
            
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-8 lg:grid-cols-3">
              {isVisible.services && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-lg  hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-violet-600/20 to-transparent rounded-bl-3xl"></div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#44ce6f] text-white shadow-md mb-6 group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-700">Student Loans</h3>
                    <p className="text-slate-600 mb-6">
                      Low-interest loans for students pursuing higher education with flexible repayment options.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        No collateral required
                      </li>
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Interest rates from 8.5%
                      </li>
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Repayment after graduation
                      </li>
                    </ul>
                    <Link href="/login">
                    <button className="relative z-10 px-3 py-2 rounded-md text-white font-semibold overflow-hidden border bg-violet-150 bg-opacity-100 transition-all duration-300">
       Apply Now
        <span className="absolute bottom-0 left-[-10%] w-0 h-[120%] bg-[#1ea664] skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
        <span className="absolute bottom-0 right-[-10%] w-0 h-[120%] border-[#1ea664] bg-[#1ea664] skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
      </button>
                    </Link>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-indigo-600/20 to-transparent rounded-bl-3xl"></div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-700">Employee Loans</h3>
                    <p className="text-slate-600 mb-6">
                      Quick personal loans for employed individuals with competitive interest rates.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Minimal documentation
                      </li>
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Approval within 24 hours
                      </li>
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Flexible tenure options
                      </li>
                    </ul>
                    <Link href="/login">
                    <button className="relative z-10 px-3 py-2 rounded-md text-white font-semibold overflow-hidden border bg-[#1ea664] bg-opacity-100 transition-all duration-300">
       Apply Now
        <span className="absolute bottom-0 left-[-10%] w-0 h-[120%]  bg-violet-150 skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
        <span className="absolute bottom-0 right-[-10%] w-0 h-[120%] border-violet-150 bg-violet-150 skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
      </button>
                    </Link>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-purple-600/20 to-transparent rounded-bl-3xl"></div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#44ce6f] to-pink-600 text-white shadow-md mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-700">Business Loans</h3>
                    <p className="text-slate-600 mb-6">
                      Financing solutions for businesses of all sizes to support growth and operations.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Customized loan structures
                      </li>
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Higher loan amounts
                      </li>
                      <li className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Business-friendly terms
                      </li>
                    </ul>
                    <Link href="/login">
                    <button className="relative z-10 px-3 py-2 rounded-md text-white font-semibold overflow-hidden border bg-violet-150 bg-opacity-100 transition-all duration-300">
       Apply Now
        <span className="absolute bottom-0 left-[-10%] w-0 h-[120%] bg-[#1ea664] skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
        <span className="absolute bottom-0 right-[-10%] w-0 h-[120%] border-[#1ea664] bg-[#1ea664] skew-x-[0deg] transition-all duration-300 group-hover:w-[62%] z-[-1]"></span>
      </button>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="relative h-24 bg-gradient-to-b from-indigo-50 to-white">
          <svg className="absolute bottom-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* About Section - Redesigned */}
      <section id="about" ref={sectionRefs.about} className="w-full py-10 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          {isVisible.about && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="inline-block rounded-full  px-3 py-1 text-sm font-medium bg-[#44ce6f] mb-4">
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-gray-800 mb-4">
                The LoanEase Advantage
              </h2>
              <p className="max-w-[800px] mx-auto text-slate-700 md:text-xl">
                We make the loan application process simple, transparent, and hassle-free
              </p>
            </motion.div>
          )}
          
          {isVisible.about && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl p-1 shadow-xl"
              >
                <div className="bg-white rounded-xl p-6 h-full">
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Approval</h3>
                    <p className="text-slate-600">
                      Our streamlined process ensures you get loan approval in as little as 24 hours, with minimal paperwork and hassle.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="relative bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-1 shadow-xl md:mt-12"
              >
                <div className="bg-white rounded-xl p-6 h-full">
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Competitive Rates</h3>
                    <p className="text-slate-600">
                      Enjoy some of the most competitive interest rates in the market, starting from just 8.5% per annum.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="relative bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-1 shadow-xl"
              >
                <div className="bg-white rounded-xl p-6 h-full">
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Flexible Repayment</h3>
                    <p className="text-slate-600">
                      Choose from a variety of repayment options that fit your budget and financial situation perfectly.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          
          {isVisible.about && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold  mb-4">Our Commitment to You</h3>
                  <p className="text-slate-700 mb-6">
                    At LoanEase, we're committed to providing a seamless, transparent, and customer-focused lending experience. Our team of financial experts is dedicated to helping you achieve your goals.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#44ce6f] flex items-center justify-center text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-slate-700">Dedicated customer support 7 days a week</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#44ce6f]  flex items-center justify-center text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-slate-700">100% digital application process</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#44ce6f]  flex items-center justify-center text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-slate-700">No hidden fees or charges</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-violet-300/30 rounded-full"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-300/30 rounded-full"></div>
                  <Image
                    src="/assets/credit.png"
                    alt="About Us"
                    width={600}
                    height={400}
                    className="rounded-2xl object-cover shadow-xl relative z-10"
                  />
                
                </div>
                
              </div>
              
            </motion.div>
          )}
        </div>
      </section>

      {/* Wave Divider */}
      <div className="relative h-24 bg-gradient-to-b from-white to-violet-50">
        <svg className="absolute bottom-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#f5f3ff" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,112C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* FAQ Section */}
      {/* <section id="faq" ref={sectionRefs.faq} className="w-full py-2 bg-violet-50 relative">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          {isVisible.faq && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <div className="inline-block rounded-full bg-violet-600/10 px-3 py-1 text-sm font-medium text-violet-600 mb-4">
                FAQ
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our loan services
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="mx-auto max-w-3xl">
            {isVisible.faq && (
              <div className="space-y-4">
                {[
                  {
                    question: "How do I apply for a loan?",
                    answer: "You can apply for a loan by creating an account, verifying your identity, and submitting the required documents through our online platform. The entire process is digital and can be completed in minutes."
                  },
                  {
                    question: "What documents do I need to apply?",
                    answer: "Typically, you'll need your ID proof, address proof, income proof (salary slips or bank statements), and PAN card. Additional documents may be required based on the loan type."
                  },
                  {
                    question: "How long does the approval process take?",
                    answer: "Most loan applications are processed within 24-48 hours, with funds disbursed shortly after approval."
                  },
                  {
                    question: "What are the interest rates?",
                    answer: "Interest rates vary based on the loan type, amount, and your credit profile. You can use our loan calculator to get an estimate. Our rates start from 8.5% per annum."
                  }
                  
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="rounded-xl overflow-hidden"
                  >
                    <div 
                      className={`bg-white p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 ${activeQuestion === index ? 'bg-gradient-to-r from-violet-50 to-indigo-50 shadow-lg' : 'hover:shadow-lg'}`}
                      onClick={() => toggleQuestion(index)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className={`text-lg font-semibold ${activeQuestion === index ? 'text-violet-800' : 'text-slate-800'}`}>
                          {faq.question}
                        </h3>
                        <ChevronDown 
                          className={`h-5 w-5 text-violet-600 transition-transform duration-300 ${activeQuestion === index ? 'rotate-180' : ''}`} 
                        />
                      </div>
                      
                      <div 
                        className={`mt-2 text-slate-600 overflow-hidden transition-all duration-300 ${activeQuestion === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="pt-2">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {isVisible.faq && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-8 text-center"
              >
                <Link href="#faq">
                  <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-300">
                    View All FAQs
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section> */}
      <HOMEFAQ />

      {/* Wave Divider */}
      <div className="relative h-24 bg-gradient-to-b from-violet-50 to-white">
        <svg className="absolute bottom-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Contact Section */}
      <section id="contact" ref={sectionRefs.contact} className="w-full py-5 relative">
        <div className="absolute top-20 right-20 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          {isVisible.contact && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <div className="inline-block rounded-full bg-violet-600/10 px-3 py-1 text-sm font-medium bg-[#44ce6f] mb-4">
                Get in Touch
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-gray-700">Contact Us</h2>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? Our team is here to help you
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="mx-auto grid max-w-5xl gap-6 py-8 lg:grid-cols-2">
            {isVisible.contact && (
              <>
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Contact Information</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <Link href="tel:+916305490580">+91 6305490580</Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <Link
                               href="https://mail.google.com/mail/?view=cm&fs=1&to=info@sklassics.com"
                               target="_blank"
                               rel="noopener noreferrer"
                              >
                               info@sklassics.com
                           </Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Address</p>
                          <p className="font-medium">Gopal Reddy Nagar, Near Vampuguda, Kapra  </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Business Hours</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Monday - Friday:</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Saturday:</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <h3 className="text-xl font-bold text-gray-700 mb-4">Send us a Message</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 outline-none transition-colors"
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 outline-none transition-colors"
              placeholder="Your email"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 outline-none transition-colors"
              placeholder="Your message"
              rows={4}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-2 rounded transition-all duration-300"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    
              </>
            )}
          </div>
        </div>
      </section>
    </main>
    
    {/* Footer */}
    <footer className="relative bg-[url('/assets/map.png')]  bg-cover bg-center bg-no-repeat text-gray-700 py-10">
    <div className="absolute top-10 right-0 transform -translate-x-1/2 -translate-y-1/2 animate-spin-very-slow">
        <svg
          width="30"
          height="200"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
        >
          <rect x="45" y="10" width="10" height="80" fill="lime" />
          <rect x="10" y="45" width="80" height="10" fill="lime" />
        </svg>
      </div>
      <div className="absolute top-[30px] left-[150px] opacity-30 animate-in ">
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="20" fill="orange" />
       
        </svg>
      </div>
          <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 ">
            
        <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">

          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative h-8 w-8 overflow-hidden rounded-md   bg-[url('/assets/map.png')] bg-cover bg-center">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                L
              </div>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              LoanEase
            </span>
          </Link>
          <p className="text-sm text-slate-600 md:text-base">Making loans accessible for everyone</p>
          <div className="flex gap-4">
            <Link href="#" className="text-slate-500 hover:text-violet-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
            <Link href="#" className="text-slate-500 hover:text-violet-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link href="#" className="text-slate-500 hover:text-violet-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="#" className="text-slate-500 hover:text-violet-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Link>
            
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-violet-800 md:text-base">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-600 hover:text-violet-600 transition-colors">
                  Student Loans
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-violet-600 transition-colors">
                  Personal Loans
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-violet-600 transition-colors">
                  Business Loans
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-violet-600 transition-colors">
                  Home Loans
                </Link>
              </li>
            </ul>
          </div>
         
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-indigo-800 md:text-base">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-blue-800 md:text-base">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-purple-800 md:text-base">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-600 hover:text-purple-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-purple-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-purple-600 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-purple-600 transition-colors">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t ">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} LoanEase. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-slate-600 hover:text-violet-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-slate-600 hover:text-violet-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-slate-600 hover:text-violet-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  </div>
)
}


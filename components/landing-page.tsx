"use client";

import { useState, useEffect, useRef } from "react";
import {
  Moon,
  Wind,
  Droplets,
  Star,
  Check,
  ArrowRight,
  X,
  Menu,
  Play,
  Pause,
  MessageCircle,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState([15]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollY } = useScroll();
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    // 클라이언트 마운트 확인
    setMounted(true);
  }, []);

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === "undefined") return;

    const handleScroll = () => setScrolled(window.scrollY > 50);
    // 초기 스크롤 상태 설정
    setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showVolumeSlider) {
        const target = e.target as HTMLElement;
        if (!target.closest(".volume-control")) {
          setShowVolumeSlider(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showVolumeSlider]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // 페이지 로드 시 자동 재생
  useEffect(() => {
    const autoPlay = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.15; // 15% 볼륨 설정
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // 자동 재생이 차단된 경우 (브라우저 정책)
          console.log(
            "자동 재생이 차단되었습니다. 사용자가 직접 재생해야 합니다."
          );
        }
      }
    };

    // 약간의 지연 후 재생 시도 (페이지 로드 완료 후)
    const timer = setTimeout(() => {
      autoPlay();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-[#0a1120] text-white selection:bg-[#2A9D8F] selection:text-white overflow-x-hidden font-sans"
      suppressHydrationWarning
    >
      {/* Audio Player */}
      <audio ref={audioRef} loop>
        <source
          src="/City Of stars  - WangOK - Wang OK.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a1120]/80 backdrop-blur-xl py-4 border-b border-white/5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2A9D8F] to-blue-500 flex items-center justify-center">
              <Moon className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              DreamNatural
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 relative volume-control">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMusic();
                  setShowVolumeSlider(!showVolumeSlider);
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
                aria-label={isPlaying ? "음악 일시정지" : "음악 재생"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
              </button>
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-full mr-2 bg-[#0a1120]/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 flex items-center gap-2 z-50"
                  >
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      min={0}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-xs text-white w-8 text-right">
                      {volume[0]}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {hasClerkKey ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm">
                      로그인
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="hidden md:flex items-center gap-2 bg-[#2A9D8F] hover:bg-[#21867a] text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                      회원가입
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                </SignedIn>
              </>
            ) : null}
            <button
              onClick={openModal}
              className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm"
            >
              사전 예약하기
            </button>
            <button className="md:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1120]/30 via-[#0a1120]/60 to-[#0a1120] z-10" />
          <img
            src="/breathtaking-night-sky-with-stars-and-calm-lake-re.jpg"
            alt="Peaceful Night Sky"
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-20 text-center pt-20">
          <motion.div
            style={{ opacity: opacityHero }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#2A9D8F] text-sm font-medium mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2A9D8F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2A9D8F]"></span>
              </span>
              Premium Sleep Wellness
            </div>
            <h1 className="text-5xl md:text-8xl font-bold leading-[1.1] mb-4 tracking-tight text-balance">
              당신의 밤, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A9D8F] via-blue-400 to-[#2A9D8F] animate-gradient-x">
                자연의 깊이
              </span>
              로 채우다
            </h1>
            <p className="text-lg md:text-xl text-[#2A9D8F] mb-8 font-medium">
              아침의 변화, 밤의 안락함
            </p>
            <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed text-balance font-light">
              깊은 잠의 본질을 찾아낸 프리미엄 수면 케어 솔루션.
              <br className="hidden md:block" /> 자연이 선사하는 가장 완벽한
              휴식을 경험하세요.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openModal}
                className="group relative inline-flex items-center gap-3 bg-[#2A9D8F] hover:bg-[#21867a] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_40px_-10px_rgba(42,157,143,0.5)]"
              >
                <span>사전 예약하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <button
                onClick={openVideoModal}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <span>브랜드 스토리</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-20"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">
            Scroll to Explore
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* Problem Section with Visuals */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2A9D8F]/20 to-blue-500/20 rounded-[2rem] blur-2xl opacity-50" />
              <img
                src="/beautiful-blonde-woman-having-trouble-sleeping-insom.jpg"
                alt="Sleep Struggle"
                className="relative rounded-[2rem] shadow-2xl border border-white/10 w-full object-cover aspect-[3/4]"
              />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-[#0a1120]/80 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm text-gray-400 uppercase tracking-wider">
                    Current Status
                  </span>
                </div>
                <p className="text-lg font-medium">
                  "생각이 멈추지 않아 잠들 수 없는 밤..."
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                당신의 밤은 <br />
                <span className="text-gray-500">안녕하신가요?</span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    title: "끊임없는 생각의 고리",
                    desc: "자려고 누우면 시작되는 걱정과 불안으로 뒤척이는 시간",
                    icon: <Wind className="w-6 h-6 text-blue-400" />,
                  },
                  {
                    title: "깨어진 생체 리듬",
                    desc: "불규칙한 생활과 스마트폰으로 무너진 수면 패턴",
                    icon: <Moon className="w-6 h-6 text-[#2A9D8F]" />,
                  },
                  {
                    title: "아침의 무거운 피로",
                    desc: "자고 일어나도 개운하지 않은 만성적인 피로감",
                    icon: <Droplets className="w-6 h-6 text-white" />,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#2A9D8F]/10 group-hover:border-[#2A9D8F]/30 transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#2A9D8F] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Full Width */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/abstract-flowing-silk-deep-blue-waves-calming-back.jpg"
            alt="Background Texture"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1120] via-transparent to-[#0a1120]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#2A9D8F] text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
              The Solution
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              자연에서 찾은 해답
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              드림내추럴은 단순한 보조제가 아닙니다. <br />
              당신의 밤을 위한 완벽한 리추얼입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pure Nature",
                desc: "100% 식물성 원료만을 사용하여 몸에 부담 없이 편안하게 스며듭니다.",
                image:
                  "/fresh-lavender-and-chamomile-herbs-macro-photograp.jpg",
              },
              {
                title: "Science Backed",
                desc: "수면 전문 연구진이 설계한 최적의 배합비로 확실한 효과를 약속합니다.",
                image:
                  "/laboratory-glassware-with-plant-extracts-clean-min.jpg",
              },
              {
                title: "Daily Ritual",
                desc: "하루를 마무리하는 가장 우아하고 편안한 습관이 되어드립니다.",
                image: "/person-drinking-tea-calm-evening-atmosphere-cozy.jpg",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients / Science */}
      <section className="py-32 bg-[#0d1626]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-12">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                검증된 성분, <br />
                <span className="text-[#2A9D8F]">투명한 공개</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="text-4xl font-bold text-[#2A9D8F]">01</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">L-테아닌 200mg</h3>
                    <p className="text-gray-400">
                      스트레스로 인한 긴장 완화에 도움을 줄 수 있는 기능성 원료
                    </p>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div className="flex gap-6">
                  <div className="text-4xl font-bold text-[#2A9D8F]">02</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">타트체리 추출물</h3>
                    <p className="text-gray-400">
                      자연 유래 멜라토닌이 풍부하여 수면의 질 개선에 도움
                    </p>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div className="flex gap-6">
                  <div className="text-4xl font-bold text-[#2A9D8F]">03</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      마그네슘 & 비타민 B6
                    </h3>
                    <p className="text-gray-400">
                      신경과 근육 기능 유지 및 에너지 이용에 필요
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-[#2A9D8F] rounded-full blur-[100px] opacity-20" />
              <img
                src="/premium-supplement-bottle-mockup-dark-background-e.jpg"
                alt="Product Composition"
                className="relative z-10 w-full drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              먼저 경험한 분들의 이야기
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "수면제는 부담스러워서 망설였는데, 이건 정말 자연스럽게 잠이 와요. 아침이 달라졌습니다. 불면증으로 2년간 고생했는데 이제는 깊은 잠을 자고 있어요.",
                author: "김민지",
                role: "마케팅팀 3년차 · 29세",
                detail: "불면증 경험 2년, 직장인",
                rating: 5,
                verified: true,
              },
              {
                text: "야근하고 집에 오면 각성 상태라 잠들기 힘들었는데, 이제는 30분이면 꿀잠 잡니다. 개발 업무로 스트레스가 많았는데 수면의 질이 완전히 달라졌어요.",
                author: "이준호",
                role: "소프트웨어 개발자 · 32세",
                detail: "야근 빈번, 각성 상태로 잠들기 어려움",
                rating: 5,
                verified: true,
              },
              {
                text: "향도 좋고 목넘김도 편해요. 자기 전 따뜻한 물과 함께 먹는 게 제 힐링 루틴이 되었어요. 운동 후에도 복용하는데 다음날 컨디션이 훨씬 좋아졌습니다.",
                author: "박서연",
                role: "필라테스 강사 · 35세",
                detail: "운동 후 회복, 수면 루틴 개선",
                rating: 5,
                verified: true,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm"
              >
                {review.verified && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-[#2A9D8F] font-medium">
                      구매 인증 완료
                    </span>
                  </div>
                )}
                <div className="flex gap-1 text-[#2A9D8F] mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-sm">
                    {review.author[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{review.author}</div>
                    <div className="text-xs text-gray-500">{review.role}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {review.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-32 relative bg-[#0d1626]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              실제 제품을 확인하세요
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              자연 친화적 패키지와 프리미엄 품질의 제품을 직접 만나보세요
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#2A9D8F] rounded-full blur-[100px] opacity-20" />
              <img
                src="/placeholder-logo1.png"
                alt="DreamNatural 제품 패키지 실물"
                className="relative z-10 w-full drop-shadow-2xl rounded-2xl"
              />
            </div>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-[#2A9D8F]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">100% 식물성 원료</h3>
                  <p className="text-gray-400">
                    자연에서 추출한 순수 성분만 사용
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-[#2A9D8F]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">환경 친화적 패키지</h3>
                  <p className="text-gray-400">재활용 가능한 소재로 제작</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-[#2A9D8F]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">편리한 복용</h3>
                  <p className="text-gray-400">하루 1회, 자기 전 30분 복용</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              자주 묻는 질문
            </h2>
            <p className="text-xl text-gray-400">궁금한 점을 확인하세요</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {mounted ? (
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem
                  value="item-1"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    DreamNatural은 어떤 효과가 있나요?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    L-테아닌, 타트체리 추출물, 마그네슘 등 검증된 성분이 수면의
                    질 개선과 스트레스 완화에 도움을 줍니다. 자연스럽고 안전한
                    수면을 지원합니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-2"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    누가 복용할 수 있나요?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    수면의 질을 개선하고 싶은 성인 누구나 복용할 수 있습니다.
                    임신·수유 중이거나 특정 약물을 복용 중인 경우 의사와 상담 후
                    복용하시기 바랍니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-3"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    부작용이 있나요?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    천연 성분으로 제조되어 일반적으로 부작용이 거의 없습니다.
                    다만 개인차에 따라 소화불량이나 졸음이 발생할 수 있으니
                    권장량을 지켜 복용하시기 바랍니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-4"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    어떻게 복용하나요?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    취침 30분 전에 따뜻한 물과 함께 1회 복용하시면 됩니다.
                    규칙적인 복용이 효과적입니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-5"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    다른 약물과 함께 복용해도 되나요?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    처방약을 복용 중이시라면 반드시 의사나 약사와 상담 후
                    복용하시기 바랍니다. 안전한 복용을 위해 전문가의 조언을
                    받으시는 것이 좋습니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="item-6"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    보관 방법은 어떻게 되나요?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    직사광선을 피하고 서늘하고 건조한 곳에 보관하세요. 어린이의
                    손이 닿지 않는 곳에 보관하시기 바랍니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="space-y-4">
                {/* 서버 사이드 렌더링용 플레이스홀더 */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4"
                  >
                    <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/calm-lake-at-night-with-moonlight-reflection-peace.jpg"
            alt="Footer Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120] via-[#0a1120]/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            오늘 밤부터 <br />
            <span className="text-[#2A9D8F]">달라질 거예요</span>
          </h2>
          <p className="text-lg md:text-xl text-[#2A9D8F] mb-4 font-medium">
            아침의 변화, 밤의 안락함
          </p>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            지금 웨이팅 리스트에 등록하시고 <br />
            가장 먼저 특별한 혜택을 만나보세요.
          </p>
          <button
            onClick={openModal}
            className="bg-white text-[#0a1120] px-12 py-5 rounded-full text-xl font-bold hover:bg-[#2A9D8F] hover:text-white transition-all shadow-2xl transform hover:-translate-y-1 mb-6"
          >
            지금 시작하기
          </button>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400 mb-4">
            <span>사전 예약 시 20% 할인</span>
            <span className="hidden md:block">•</span>
            <span>특별 사은품 증정</span>
            <span className="hidden md:block">•</span>
            <span>우선 배송 혜택</span>
          </div>
          <p className="text-xs text-gray-500">
            * 사전 예약 고객에게만 제공되는 특별 혜택입니다. 수량 한정으로 조기
            마감될 수 있습니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm bg-[#050911]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
            <Moon className="w-5 h-5" />
            <span className="font-bold">DreamNatural</span>
          </div>
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Youtube
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <p>© 2025 DreamNatural. All rights reserved.</p>
        </div>
      </footer>

      {/* AI Assistant Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#2A9D8F] hover:bg-[#21867a] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="AI 도우미에게 질문하기"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a1120] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2A9D8F]/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {!isSubmitted ? (
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">
                    웨이팅 리스트 등록
                  </h3>
                  <p className="text-gray-400 mb-8">
                    출시 알림과 함께 얼리버드 혜택을 보내드립니다.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setTimeout(() => setIsSubmitted(true), 800);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        이름
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="홍길동"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#2A9D8F] focus:ring-1 focus:ring-[#2A9D8F] transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        이메일
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="hello@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#2A9D8F] focus:ring-1 focus:ring-[#2A9D8F] transition-all outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#2A9D8F] hover:bg-[#21867a] text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-4"
                    >
                      등록하기
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-12 relative z-10">
                  <div className="w-20 h-20 bg-[#2A9D8F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-[#2A9D8F]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">등록되었습니다!</h3>
                  <p className="text-gray-400">
                    가장 먼저 소식을 전해드릴게요. <br />
                    오늘도 편안한 밤 되세요. 🌙
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0a1120] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2A9D8F]/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">브랜드 스토리</h3>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                  <video
                    controls
                    autoPlay
                    className="w-full h-full"
                    src="/19700121_1859_692451923cc88191b79a63db0a3f6fe1.mp4"
                  >
                    브라우저가 오디오 태그를 지원하지 않습니다.
                  </video>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

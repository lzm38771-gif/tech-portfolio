import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, Cpu, Database, Globe, Layers, Terminal,
  ArrowRight, Sparkles, Zap, Rocket, ChevronDown,
  Mail, ExternalLink, Heart, User
} from 'lucide-react'
import './App.css'

const skillIcons = [Code2, Cpu, Database, Globe, Layers, Terminal]
const skillIconColors = ['#00f0ff', '#8b5cf6', '#ff00aa', '#00f0ff', '#8b5cf6', '#ff00aa']

const navItems = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'work', label: '作品' },
  { id: 'contact', label: '联系' },
]

const skills = [
  { name: 'React / Vue', level: 95 },
  { name: 'Node.js', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'Python / AI', level: 85 },
  { name: 'UI/UX Design', level: 82 },
  { name: 'DevOps / Cloud', level: 78 },
]

const projects = [
  { name: 'AI 智能平台', desc: '机器学习可视化分析系统', icon: Sparkles },
  { name: '区块链浏览器', desc: '去中心化数据追踪工具', icon: Globe },
  { name: '元宇宙展厅', desc: '虚拟现实交互体验', icon: Rocket },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id))
      const scrollPos = window.scrollY + window.innerHeight / 3

      sections.forEach((section, index) => {
        if (section) {
          const top = section.offsetTop
          const height = section.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(navItems[index].id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`app ${isLoaded ? 'loaded' : ''}`}>
      <div className="scanlines" />

      <motion.nav
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          TECH<span className="accent">.IO</span>
        </motion.div>

        <div className="nav-links">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </div>

        <motion.button
          className="cyber-btn primary small"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 240, 255, 0.6)' }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-glow"></span>
          <span className="btn-text"> Hire Me</span>
        </motion.button>
      </motion.nav>

      <section id="home" className="hero">
        <div className="hero-bg-grid" />

        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="tag-line" variants={itemVariants}>
            <motion.span
              className="line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <span>全栈开发者 / 创意设计师</span>
            <motion.div
              className="status-dot"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            <motion.span
              className="title-text"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              创造数字
            </motion.span>
            <br />
            <motion.span
              className="title-text gradient"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              未来体验
            </motion.span>
          </motion.h1>

          <motion.p
            className="hero-desc"
            variants={itemVariants}
          >
            专注于打造沉浸式科技感界面，以创新设计驱动用户体验升级
          </motion.p>

          <motion.div className="hero-buttons" variants={itemVariants}>
            <motion.button
              className="cyber-btn primary"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-glow" />
              <span className="btn-text">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  开始探索
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ArrowRight size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />
                </motion.span>
              </span>
            </motion.button>

            <motion.button
              className="cyber-btn secondary"
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-text">查看作品</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="hex-grid">
            {[...Array(19)].map((_, i) => (
              <motion.div
                key={i}
                className="hex"
                style={{ animationDelay: `${i * 0.15}s` }}
                variants={floatVariants}
                initial="initial"
                animate="animate"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      <section id="about" className="about">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">01</span>
          <h2 className="section-title">关于我</h2>
        </motion.div>

        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="about-text">
            <p className="about-bio">
              全栈开发工程师，热爱技术创作与交互设计。拥有多年互联网产品开发经验，
              擅长将前沿技术与创意设计结合，打造令人印象深刻的数字产品。
            </p>
            <p className="about-bio">
              追求代码即艺术的设计理念，相信好的用户体验来自对细节的极致追求。
              期待与志同道合的伙伴一起创造无限可能。
            </p>

            <motion.div
              className="social-links"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {[User, Heart, Mail].map((Icon, i) => (
                <motion.button
                  key={i}
                  className="social-btn"
                  whileHover={{ scale: 1.2, color: '#00f0ff' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                </motion.button>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="about-avatar"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="avatar-ring"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 30px rgba(0, 240, 255, 0.1)',
                  '0 0 50px rgba(0, 240, 255, 0.5), inset 0 0 40px rgba(0, 240, 255, 0.2)',
                  '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 30px rgba(0, 240, 255, 0.1)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="avatar-inner"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Zap size={48} color="#00f0ff" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="about-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {[
            { number: '5+', label: '年开发经验', icon: Code2 },
            { number: '100+', label: '完成项目', icon: Layers },
            { number: '50+', label: '客户好评', icon: Sparkles },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 240, 255, 0.6)' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: i * 0.1 }}
              >
                <stat.icon size={32} color="#00f0ff" />
              </motion.div>
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="skills" className="skills">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">02</span>
          <h2 className="section-title">专业技能</h2>
        </motion.div>

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {skills.map((skill, index) => {
            const Icon = skillIcons[index]
            const color = skillIconColors[index]
            return (
              <motion.div
                key={skill.name}
                className="skill-card"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  borderColor: color,
                  boxShadow: `0 0 30px ${color}33`
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="skill-icon"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={24} color={color} />
                </motion.div>
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percent" style={{ color }}>{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-progress"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section id="work" className="work">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">03</span>
          <h2 className="section-title">精选作品</h2>
        </motion.div>

        <motion.div
          className="project-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              className="project-card"
              variants={itemVariants}
              whileHover={{
                y: -15,
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="project-visual"
                style={{
                  background: `linear-gradient(135deg, ${
                    i === 0 ? '#00f0ff, #0066ff' : i === 1 ? '#8b5cf6, #ff00aa' : '#ff00aa, #ffaa00'
                  })`
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="project-icon"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <project.icon size={48} color="rgba(255,255,255,0.9)" />
                </motion.div>
                <div className="project-overlay">
                  <ExternalLink size={24} />
                </div>
              </motion.div>
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="contact" className="contact">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">04</span>
          <h2 className="section-title">联系我们</h2>
        </motion.div>

        <motion.p
          className="contact-desc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          有想法？让我们一起创造不凡的数字体验
        </motion.p>

        <motion.button
          className="cyber-btn primary large"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          whileHover={{
            scale: 1.08,
            boxShadow: '0 0 50px rgba(0, 240, 255, 0.7)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-glow" />
          <span className="btn-text">
            立即开始
            <ArrowRight size={20} style={{ marginLeft: 10, verticalAlign: 'middle' }} />
          </span>
        </motion.button>
      </section>

      <footer className="footer">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          © 2024 TECH.IO — 探索无限可能
        </motion.p>
      </footer>
    </div>
  )
}

export default App
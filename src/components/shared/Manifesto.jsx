import { motion } from 'framer-motion'
import { Github, ExternalLink, Heart } from 'lucide-react'

/**
 * Manifesto / About page component
 * "The Human Algorithm" - exploring the intersection of craft and computation
 */
export default function Manifesto() {
  // Animation variants for staggered fade-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-canvas-white">
      <motion.article
        className="max-w-3xl mx-auto px-6 py-12 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Title */}
        <motion.header variants={itemVariants} className="text-center mb-16">
          <h1 
            className="text-4xl lg:text-5xl font-bold text-charcoal mb-6"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            The Human Algorithm
          </h1>
          <p className="text-lg text-charcoal/60 italic">
            Where loops meet logic, and stitches become data
          </p>
        </motion.header>

        {/* Main Manifesto Text */}
        <motion.section variants={itemVariants} className="mb-16">
          <div 
            className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <p className="text-xl mb-6 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              Every crochet pattern is an algorithm. Every stitch is a variable. 
              Every row is a loop—not just of yarn, but of logic. Long before 
              computers existed, crafters were executing complex programs with 
              nothing but hooks and thread.
            </p>
            <p className="mb-6">
              This project is an exploration of that hidden computational layer 
              within traditional craft. We examine the hyperbolic geometry that 
              makes doilies ruffle, the graph theory that prevents color clashes 
              in granny squares, and the pattern recognition that allows us to 
              identify stitches at a glance.
            </p>
            <p>
              The Algorithmic Loop is not about replacing human creativity with 
              machines. It&apos;s about revealing the beautiful mathematics that 
              crafters have intuited for generations—and celebrating the 
              sophisticated algorithms embedded in every handmade piece.
            </p>
          </div>
        </motion.section>

        {/* Why This Matters */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 
            className="text-2xl lg:text-3xl font-bold text-charcoal mb-6 border-b border-charcoal/10 pb-3"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Why This Matters
          </h2>
          <div 
            className="text-charcoal/80 leading-relaxed space-y-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <p>
              In an age of fast fashion and disposable goods, handcraft represents 
              something radical: patience, intention, and deep understanding of 
              materials. When we recognize crochet as computation, we elevate it 
              from &quot;hobby&quot; to &quot;practice&quot;—a legitimate form of mathematical thinking.
            </p>
            <p>
              This matters because it bridges worlds that are too often kept 
              separate. The grandmother teaching her grandchild to crochet is 
              passing down algorithms. The mathematician studying hyperbolic 
              planes could learn from a doily. When we see these connections, 
              we expand what &quot;technology&quot; and &quot;intelligence&quot; can mean.
            </p>
          </div>
        </motion.section>

        {/* The Mathematics of Craft */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 
            className="text-2xl lg:text-3xl font-bold text-charcoal mb-6 border-b border-charcoal/10 pb-3"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            The Mathematics of Craft
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-charcoal/5 rounded-lg p-6">
              <h3 className="font-bold text-charcoal mb-2 font-mono text-sm uppercase tracking-wide">
                Hyperbolic Geometry
              </h3>
              <p className="text-sm text-charcoal/70">
                Doilies naturally model hyperbolic planes. Too many stitches per 
                row creates exponential growth, causing the beautiful ruffles that 
                mathematicians once thought impossible to visualize.
              </p>
            </div>
            <div className="bg-charcoal/5 rounded-lg p-6">
              <h3 className="font-bold text-charcoal mb-2 font-mono text-sm uppercase tracking-wide">
                Graph Coloring
              </h3>
              <p className="text-sm text-charcoal/70">
                Arranging granny squares so no adjacent pieces share colors is a 
                classic computer science problem. Crafters solve it intuitively; 
                computers use backtracking algorithms.
              </p>
            </div>
            <div className="bg-charcoal/5 rounded-lg p-6">
              <h3 className="font-bold text-charcoal mb-2 font-mono text-sm uppercase tracking-wide">
                Pattern Recognition
              </h3>
              <p className="text-sm text-charcoal/70">
                Identifying stitch types from images uses the same neural network 
                principles as facial recognition. Texture, repetition, and 
                structure become learnable features.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Future Explorations */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 
            className="text-2xl lg:text-3xl font-bold text-charcoal mb-6 border-b border-charcoal/10 pb-3"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Future Explorations
          </h2>
          <div 
            className="text-charcoal/80 leading-relaxed space-y-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <p>This is just the beginning. Future directions could include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pattern generation from mathematical functions</li>
              <li>3D visualization of hyperbolic crochet surfaces</li>
              <li>Custom stitch pattern recognition trained on user uploads</li>
              <li>Procedural blanket designs using cellular automata</li>
              <li>Integration with knitting machine firmware</li>
            </ul>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 
            className="text-2xl lg:text-3xl font-bold text-charcoal mb-6 border-b border-charcoal/10 pb-3"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Built With
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              'React',
              'Vite',
              'Tailwind CSS',
              'Framer Motion',
              'Chart.js',
              'TensorFlow.js',
              'MobileNet',
              'Lucide Icons',
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-charcoal text-canvas-white rounded-full text-sm font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Credits & Links */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 
            className="text-2xl lg:text-3xl font-bold text-charcoal mb-6 border-b border-charcoal/10 pb-3"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Credits & Inspiration
          </h2>
          <div 
            className="text-charcoal/80 leading-relaxed space-y-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <p>
              Inspired by the work of mathematician Daina Taimina, who first 
              crocheted models of hyperbolic planes, and by countless crafters 
              who have passed down these algorithms through generations.
            </p>
            <p>
              Special thanks to the open-source community for the incredible 
              tools that made this project possible.
            </p>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants} 
          className="text-center pt-8 border-t border-charcoal/10"
        >
          <p className="text-charcoal/60 mb-4 flex items-center justify-center gap-2">
            Made with <Heart size={16} className="text-red-500 fill-red-500" /> and yarn
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/piepengu/crochet_lab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-charcoal/60 hover:text-yarn-blue transition-colors"
            >
              <Github size={20} />
              <span className="text-sm">View Source</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-charcoal/60 hover:text-yarn-blue transition-colors"
            >
              <ExternalLink size={20} />
              <span className="text-sm">Portfolio</span>
            </a>
          </div>
        </motion.footer>
      </motion.article>
    </div>
  )
}

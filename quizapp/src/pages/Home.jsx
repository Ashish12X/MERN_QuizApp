import { useNavigate } from "react-router-dom";

export default function Home({admin}) {
  const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">

      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <span className="mb-4 px-4 py-1 text-sm font-medium rounded-full bg-white/20 text-white backdrop-blur">
          Smart Online Quiz Platform
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
          Learn. Practice. <br className="hidden md:block" />
          Test Your Knowledge.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/90">
          Quizzer helps students and professionals evaluate their skills through
          carefully designed quizzes with instant feedback and performance insights.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <button
           className="px-8 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition"
           onClick={() => navigate('/quiz')}>
            Attemp a Quiz
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Expert-Curated Questions"
          desc="High-quality questions designed to test real understanding."
        />
        <FeatureCard
          title="Instant Results"
          desc="Get real-time feedback and performance evaluation."
        />
        <FeatureCard
          title="Skill-Based Learning"
          desc="Track progress and improve with each attempt."
        />
      </div>

      {!admin && (
        <div className="bg-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Become a Member
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Are you a teacher, mentor, or trainer? Create customized quizzes
              for your students, track their progress, and manage assessments
              effortlessly—all in one place.
            </p>

            <ul className="space-y-3 text-white/80">
              <li>• Create and manage unlimited quizzes</li>
              <li>• Assign quizzes directly to students</li>
              <li>• Analyze performance with detailed reports</li>
              <li>• Save time with automated evaluation</li>
            </ul>

            <button className="mt-8 px-8 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition"
            onClick={() => navigate('/member')}>
              Become a Member
            </button>
          </div>

          <div className="rounded-2xl bg-white/20 backdrop-blur-xl p-10 text-white shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">
              Designed for Educators
            </h3>
            <p className="text-white/80">
              Quizzer empowers educators with intuitive tools to design quizzes,
              monitor student growth, and deliver effective learning experiences
              without technical complexity.
            </p>
          </div>

        </div>
      </div>
      )}
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur-lg p-6 text-white shadow-lg hover:scale-105 transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/80">{desc}</p>
    </div>
  );
}

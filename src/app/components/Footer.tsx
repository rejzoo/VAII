export default function Footer() {
    return (
      <div className="flex items-center justify-center space-x-2 py-2 border-t border-purple-400">
        <span className="text-sm text-purple-100">By</span>
        <a
          href="../stats/MauserIII"
          className="text-sm font-medium text-purple-100 hover:text-purple-200 transition-colors duration-200"
        >
          rejzo
        </a>
        <span className="text-sm text-purple-100">2024</span>
      </div>
    );
  }
  
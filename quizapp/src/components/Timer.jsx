import { useEffect, useState } from "react";

export default function Timer({ duration, onFinish }) {
  const [time, setTime] = useState(duration*60);

  useEffect(() => {
    if (time <= 0) {
      onFinish();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="text-3xl text-black font-bold text-indigo-600">
      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}

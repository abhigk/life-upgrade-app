import Head from 'next/head';

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <img src="https://img.icons8.com/emoji/48/000000/palm-tree-emoji.png" alt="Logo" className="h-8" />
                <h1 className="text-xl font-semibold">Home</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button className="focus:outline-none">
                  <img src="https://img.icons8.com/ios-filled/50/000000/menu-2.png" alt="Menu" className="h-6" />
                </button>
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full cursor-pointer">Today</div>
              <div className="mx-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full cursor-pointer">Weekly</div>
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full cursor-pointer">Overall</div>
            </div>
            <div className="flex justify-around mb-4">
              <button className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">All</button>
              <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">Morning</button>
              <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">Afternoon</button>
              <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">Evening</button>
            </div>
            <div className="space-y-4">
              <div className="bg-red-200 text-red-800 p-4 rounded-lg flex items-center space-x-4">
                <img src="https://img.icons8.com/emoji/48/000000/check-mark-emoji.png" alt="Set Small Goals" className="h-8" />
                <span>Set Small Goals</span>
              </div>
              <div className="bg-purple-200 text-purple-800 p-4 rounded-lg flex items-center space-x-4">
                <img src="https://img.icons8.com/emoji/48/000000/trophy-emoji.png" alt="Work" className="h-8" />
                <span>Work</span>
              </div>
              <div className="bg-green-200 text-green-800 p-4 rounded-lg flex items-center space-x-4">
                <img src="https://img.icons8.com/emoji/48/000000/smiling-face-with-halo-emoji.png" alt="Meditation" className="h-8" />
                <span>Meditation</span>
              </div>
              <div className="bg-orange-200 text-orange-800 p-4 rounded-lg flex items-center space-x-4">
                <img src="https://img.icons8.com/emoji/48/000000/basketball-emoji.png" alt="Basketball" className="h-8" />
                <span>Basketball</span>
              </div>
              <div className="text-gray-800 p-4 rounded-lg">
                <span>Completed</span>
              </div>
              <div className="bg-blue-200 text-blue-800 p-4 rounded-lg flex items-center space-x-4">
                <img src="https://img.icons8.com/emoji/48/000000/sleeping-face.png" alt="Sleep Over 8h" className="h-8" />
                <span>Sleep Over 8h</span>
                <img src="https://img.icons8.com/ios-filled/50/000000/checkmark.png" alt="Check" className="h-6 ml-auto" />
              </div>
              <div className="bg-pink-200 text-pink-800 p-4 rounded-lg flex items-center space-x-4">
                <img src="https://img.icons8.com/emoji/48/000000/video-game-emoji.png" alt="Playing Games" className="h-8" />
                <span>Playing Games</span>
                <img src="https://img.icons8.com/ios-filled/50/000000/checkmark.png" alt="Check" className="h-6 ml-auto" />
              </div>
              <div className="bg-teal-200 text-teal-800 p-4 rounded-lg flex items-center space-x-4">
                <img src="https://img.icons8.com/emoji/48/000000/boxing-glove.png" alt="Exercise or Workout" className="h-8" />
                <span>Exercise or Workout</span>
                <button className="bg-purple-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
                  <span className="text-xl">+</span>
                </button>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-around">
            <button className="focus:outline-none">
              <img src="https://img.icons8.com/ios-filled/50/000000/home-page.png" alt="Home" className="h-6" />
            </button>
            <button className="focus:outline-none">
              <img src="https://img.icons8.com/ios-filled/50/000000/area-chart.png" alt="Mood Stat" className="h-6" />
            </button>
            <button className="focus:outline-none">
              <img src="https://img.icons8.com/ios-filled/50/000000/report-card.png" alt="Report" className="h-6" />
            </button>
            <button className="focus:outline-none">
              <img src="https://img.icons8.com/ios-filled/50/000000/list.png" alt="My Habits" className="h-6" />
            </button>
            <button className="focus:outline-none">
              <img src="https://img.icons8.com/ios-filled/50/000000/user.png" alt="Account" className="h-6" />
            </button>
          </div>
        </div>
  );
}

export default HomeScreen;

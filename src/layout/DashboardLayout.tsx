import { useState, type ReactNode } from "react";
import SideBar from "../components/Sidebar/SideBar";
import DashboardHeader from "../components/Header/DashboardHeader";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar wrapper - fixed on all screen sizes */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <SideBar onClose={closeSidebar} />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-[220px] min-h-screen">
        {/* Mobile header with menu button */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <IoClose className="w-6 h-6 text-gray-700" />
            ) : (
              <HiOutlineMenuAlt2 className="w-6 h-6 text-gray-700" />
            )}
          </button>
          <svg
            width="100"
            height="24"
            viewBox="0 0 133 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M35.0898 27.3739V16.8965H37.305V21.5162H37.4431L41.2135 16.8965H43.8687L39.9806 21.5878L43.9147 27.3739H41.2647L38.3946 23.0663L37.305 24.3964V27.3739H35.0898ZM54.0596 22.1352C54.0596 23.2778 53.843 24.2498 53.4098 25.0513C52.9801 25.8528 52.3935 26.465 51.65 26.8879C50.9099 27.3074 50.0777 27.5171 49.1534 27.5171C48.2223 27.5171 47.3867 27.3057 46.6466 26.8828C45.9065 26.4599 45.3216 25.8477 44.8919 25.0462C44.4621 24.2447 44.2472 23.2744 44.2472 22.1352C44.2472 20.9927 44.4621 20.0206 44.8919 19.2191C45.3216 18.4176 45.9065 17.8071 46.6466 17.3876C47.3867 16.9647 48.2223 16.7533 49.1534 16.7533C50.0777 16.7533 50.9099 16.9647 51.65 17.3876C52.3935 17.8071 52.4727 18.4176 52.9024 19.2191C53.343 20.0206 54.0596 20.9927 54.0596 22.1352ZM51.8137 22.1352C51.8137 21.3951 51.7028 20.771 51.4811 20.2628C51.2629 19.7546 50.9542 19.3692 50.5552 19.1066C50.1561 18.844 49.6889 18.7127 49.1534 18.7127C48.6179 18.7127 48.1507 18.844 47.7516 19.1066C47.3526 19.3692 47.0422 19.7546 46.8206 20.2628C46.6023 20.771 46.4931 21.3951 46.4931 22.1352C46.4931 22.8753 46.6023 23.4995 46.8206 24.0076C47.0422 24.5158 47.3526 24.9012 47.7516 25.1638C48.1507 25.4264 48.6179 25.5578 49.1534 25.5578C49.6889 25.5578 50.1561 25.4264 50.5552 25.1638C50.9542 24.9012 51.2629 24.5158 51.4811 24.0076C51.7028 23.4995 51.8137 22.8753 51.8137 22.1352ZM57.0025 16.8965L59.5349 24.8569H59.6321L62.1696 16.8965H64.6252L61.0134 27.3739H58.1587L54.5417 16.8965H57.0025ZM68.1015 16.8965V27.3739H65.8863V16.8965H68.1015ZM79.5521 22.1352C79.5521 23.2778 79.3356 24.2498 78.9024 25.0513C78.4727 25.8528 77.8861 26.465 77.1426 26.8879C76.4025 27.3074 75.5703 27.5171 74.646 27.5171C73.7149 27.5171 72.8793 27.3057 72.1392 26.8828C71.3991 26.4599 70.8142 25.8477 70.3844 25.0462C69.9547 24.2447 69.7398 23.2744 69.7398 22.1352C69.7398 20.9927 69.9547 20.0206 70.3844 19.2191C70.8142 18.4176 71.3991 17.8071 72.1392 17.3876C72.8793 16.9647 73.7149 16.7533 74.646 16.7533C75.5703 16.7533 76.4025 16.9647 77.1426 17.3876C77.8861 17.8071 78.4727 18.4176 78.9024 19.2191C79.3356 20.0206 79.5521 20.9927 79.5521 22.1352ZM77.3063 22.1352C77.3063 21.3951 77.1954 20.771 76.9737 20.2628C76.7554 19.7546 76.4468 19.3692 76.0477 19.1066C75.6487 18.844 75.1815 18.7127 74.646 18.7127C74.1105 18.7127 73.6433 18.844 73.2442 19.1066C72.8452 19.3692 72.5348 19.7546 72.3131 20.2628C72.0949 20.771 71.9857 21.3951 71.9857 22.1352C71.9857 22.8753 72.0949 23.4995 72.3131 24.0076C72.5348 24.5158 72.8452 24.9012 73.2442 25.1638C73.6433 25.4264 74.1105 25.5578 74.646 25.5578C75.1815 25.5578 75.6487 25.4264 76.0477 25.1638C76.4468 24.9012 76.7554 24.5158 76.9737 24.0076C77.1954 23.4995 77.3063 22.8753 77.3063 22.1352Z"
              fill="#111827"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30.3255 0C30.3255 6.99911 25.5714 12.8577 19.3046 14.2143C18.4162 14.4184 17.4918 14.5145 16.5434 14.5145H0V0H11.0329V9.6763H8.27168V2.90529H2.76123V11.6212H16.5434C17.4918 11.6212 18.4162 11.4891 19.3046 11.249C23.1583 10.1925 26.2197 6.9751 27.2281 2.90529H19.3046V9.6763H16.5434V0H30.3255Z"
              fill="#FF4800"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.3046 29.041H27.2281C26.2076 24.9832 23.1583 21.7537 19.3046 20.6973C18.4282 20.4571 17.5038 20.3251 16.5434 20.3251H2.76123V29.041H8.27168V22.6541H11.0329V31.9463H0V17.4198H16.5434C17.4918 17.4198 18.4162 17.5158 19.3046 17.7199C25.5714 19.0765 30.3255 24.9592 30.3255 31.9463H16.5434V22.9182H19.3046V29.041Z"
              fill="#FF4800"
            />
            <path d="M11.0329 8.40369H8.27167V23.9266H11.0329V8.40369Z" fill="#FF4800" />
            <path d="M19.3046 8.87195H16.5434V23.9266H19.3046V8.87195Z" fill="#FF4800" />
            <path d="M2.76123 7.26318H0V23.9266H2.76123V7.26318Z" fill="#FF4800" />
          </svg>
        </div>

        {/* Desktop page header */}
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>

        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

import { CheckCircle, Clock, Plus } from '@phosphor-icons/react';

const processShirt = {
  name: 'Quy trình sản xuất áo sơ mi',
  product: 'Áo sơ mi nam',
  estimate: '24 giờ ước tính',
  status: 'Đang hoạt động',
  steps: [
    {
      id: 1,
      name: 'Thiết kế và tạo mẫu',
      desc: 'Tạo thiết kế, cắt mẫu thử và kiểm tra kích thước',
      time: '4h',
      staff: '2/3',
      skills: ['Thiết kế', 'Cắt may'],
      status: 'Hoàn thành',
      canStart: false,
    },
    {
      id: 2,
      name: 'Chuẩn bị nguyên liệu',
      desc: 'Kiểm tra và chuẩn bị vải, nút, chỉ và phụ liệu',
      time: '2h',
      staff: '3/4',
      skills: ['Quản lý kho', 'Kiểm tra chất lượng'],
      status: 'Hoàn thành',
      canStart: false,
    },
    {
      id: 3,
      name: 'Cắt vải',
      desc: 'Trải vải, vẽ rập và cắt theo kích thước',
      time: '6h',
      staff: '5/6',
      skills: ['Cắt vải', 'Đọc rập'],
      status: 'Đang thực hiện',
      canStart: false,
    },
    {
      id: 4,
      name: 'May chính',
      desc: 'May thân áo, tay áo, cổ áo theo quy trình',
      time: '8h',
      staff: '0/8',
      skills: ['May công nghiệp', 'May tay'],
      status: 'Chờ thực hiện',
      canStart: true,
    },
    {
      id: 5,
      name: 'Hoàn thiện',
      desc: 'Khuy nút, là ủi, kiểm tra chất lượng cuối',
      time: '4h',
      staff: '0/6',
      skills: ['Hoàn thiện', 'Kiểm tra CL', '+1'],
      status: 'Chờ thực hiện',
      canStart: true,
    },
  ],
};

const processJean = {
  name: 'Quy trình sản xuất quần jean',
  product: 'Quần jean nữ',
  estimate: '28 giờ ước tính',
  status: 'Đang hoạt động',
  steps: [
    {
      id: 1,
      name: 'Thiết kế mẫu',
      desc: 'Thiết kế form dáng và tạo mẫu quần jean',
      time: '5h',
      staff: '2/3',
      skills: ['Thiết kế', 'Cắt mẫu'],
      status: 'Hoàn thành',
      canStart: false,
    },
    {
      id: 2,
      name: 'Chuẩn bị vải jean',
      desc: 'Kiểm tra vải jean, phụ liệu và khoá kéo',
      time: '3h',
      staff: '2/3',
      skills: ['Quản lý kho'],
      status: 'Hoàn thành',
      canStart: false,
    },
    {
      id: 3,
      name: 'Cắt vải jean',
      desc: 'Cắt vải theo mẫu, chú ý hướng vải',
      time: '6h',
      staff: '4/5',
      skills: ['Cắt vải jean', 'Đọc rập'],
      status: 'Đang thực hiện',
      canStart: false,
    },
    {
      id: 4,
      name: 'May jean',
      desc: 'May quần, gắn túi, đính khoá kéo',
      time: '10h',
      staff: '0/10',
      skills: ['May jean', 'May công nghiệp'],
      status: 'Chờ thực hiện',
      canStart: true,
    },
    {
      id: 5,
      name: 'Xử lý hoàn thiện',
      desc: 'Tạo hiệu ứng, giặt, là ủi và kiểm tra',
      time: '4h',
      staff: '0/6',
      skills: ['Xử lý jean', 'Giặt công nghiệp', '+1'],
      status: 'Chờ thực hiện',
      canStart: true,
    },
  ],
};

export default function ProductionProcessPage() {
  // const [activeStep, setActiveStep] = useState<number | null>(null);
  const getSummary = steps => {
    const completed = steps.filter(s => s.status === 'Hoàn thành').length;
    const doing = steps.filter(s => s.status === 'Đang thực hiện').length;
    const waiting = steps.filter(s => s.status === 'Chờ thực hiện').length;
    const percent = Math.round((completed / steps.length) * 100);
    return { completed, doing, waiting, percent };
  };
  const shirtSummary = getSummary(processShirt.steps);
  const jeanSummary = getSummary(processJean.steps);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Quy Trình Sản Xuất</h1>
          <p className="text-gray-600">Theo dõi và quản lý các bước trong quy trình sản xuất</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} /> Tạo quy trình mới
        </button>
      </div>

      <div className="space-y-6">
        {/* Quy trình SX áo sơ mi */}
        {[processShirt, processJean].map((proc, procIdx) => {
          const summary = procIdx === 0 ? shirtSummary : jeanSummary;
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200" key={proc.name}>
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-git-branch h-6 w-6 text-purple-600"
                    >
                      <line x1="6" x2="6" y1="3" y2="15"></line>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M18 9a9 9 0 0 1-9 9"></path>
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{proc.name}</h3>
                      <p className="text-sm text-gray-600">
                        {proc.product} • {proc.estimate}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {proc.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="relative">
                  <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200"></div>
                  <div
                    className="absolute top-8 left-8 h-0.5 bg-blue-500 transition-all duration-500"
                    style={{ width: '40%' }}
                  ></div>
                  <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-3 miniLaptop:grid-cols-5 gap-4">
                    {proc.steps.map((step, idx) => (
                      <div className="relative" key={step.id}>
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {step.status === 'Hoàn thành' ? (
                                <CheckCircle size={20} className="text-green-600" />
                              ) : step.status === 'Đang thực hiện' ? (
                                <Clock size={20} className="text-blue-600" />
                              ) : (
                                <Clock size={20} className="text-gray-400" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                Bước {step.id}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                step.status === 'Hoàn thành'
                                  ? 'bg-green-100 text-green-800'
                                  : step.status === 'Đang thực hiện'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{step.name}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{step.desc}</p>
                          <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center justify-between">
                              <span>Thời gian:</span>
                              <span className="font-medium">{step.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Nhân viên:</span>
                              <span className="font-medium">{step.staff}</span>
                            </div>
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 mb-1">Kỹ năng yêu cầu:</div>
                              <div className="flex flex-wrap gap-1">
                                {step.skills.map((skill, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {step.status === 'Đang thực hiện' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <button
                                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                                // onClick={() => setActiveStep(idx)}
                              >
                                Xem chi tiết
                              </button>
                            </div>
                          )}
                          {step.status === 'Chờ thực hiện' && step.canStart && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Bắt đầu
                              </button>
                            </div>
                          )}
                        </div>
                        {idx < proc.steps.length - 1 && (
                          <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-arrow-right h-4 w-4 text-gray-400"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 smallLaptop:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
                      <div className="text-sm text-gray-600">Hoàn thành</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{summary.doing}</div>
                      <div className="text-sm text-gray-600">Đang thực hiện</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-600">{summary.waiting}</div>
                      <div className="text-sm text-gray-600">Chờ thực hiện</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{summary.percent}%</div>
                      <div className="text-sm text-gray-600">Tiến độ tổng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

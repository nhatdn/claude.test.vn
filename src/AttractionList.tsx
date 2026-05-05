const attractions = [
  { id: 1, name: 'Chùa Cầu', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 2, name: 'Miếu Quan Công', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 3, name: 'Bảo tàng Hội An', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 4, name: 'Chùa Cầu', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 5, name: 'Hội quán Phúc Kiến', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 6, name: 'Nhà cổ Tấn Ký', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 7, name: 'Bảo tàng Văn hóa Sa Huỳnh', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 8, name: 'Hội quán Triều Châu', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
  { id: 9, name: 'Đình Cẩm Phô', duration: '2 phút 27 giây', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Japanese_Bridge_Hoi_An.jpg/320px-Japanese_Bridge_Hoi_An.jpg' },
]

export default function AttractionList() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-sm bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-100">
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-[17px] font-semibold text-gray-900">
            Danh sách các điểm tham quan
          </h1>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3 px-4 pb-6">
          {attractions.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-3 py-3"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-gray-900 truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-[13px] text-gray-500">{item.duration}</span>
                </div>
              </div>

              {/* Arrow button */}
              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-orange-400 flex items-center justify-center shrink-0 hover:bg-orange-500 active:scale-95 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

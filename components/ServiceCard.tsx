import { Star, MapPin, CheckCircle, Phone } from "lucide-react";

export default function ServiceCard({ data }: { data: any }) {
    return (
        <div className="bg-white border rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex gap-4">
                <img src={data.image_url} alt={data.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1">
                    <div className="flex items-center gap-1 font-bold text-gray-800">
                        {data.name} {data.is_verified && <CheckCircle size={14} className="text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-500">{data.category}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            <Star size={12} fill="currentColor" /> {data.rating}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                            <MapPin size={12} /> {data.distance_text}
                        </span>
                    </div>
                </div>
            </div>
            <a
                href={`https://wa.me/${data.whatsapp_number}`}
                className="mt-4 flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition"
            >
                <Phone size={18} /> Hubungi via WhatsApp
            </a>
        </div>
    );
}
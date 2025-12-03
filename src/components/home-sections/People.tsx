import React from "react";
import Image from "next/image";

// Import images from public/assets/people folder
import person1 from "@/../public/assets/people/person1.jpeg";
import person2 from "@/../public/assets/people/person2.jpeg";
import person3 from "@/../public/assets/people/person3.jpeg";
import person4 from "@/../public/assets/people/person4.jpeg";

const People = () => {
    const peopleImages = [person1, person2, person3, person4];

    return (
        <div className="flex items-center">
            {/* Avatar group */}
            <div className="flex -space-x-3">
                {peopleImages.map((img, idx) => (
                    <Image key={idx} src={img} alt={`Person ${idx + 1}`} width={44} height={44} className="h-11 w-11 rounded-full border-2 border-black object-cover shadow-md" priority />
                ))}
            </div>

            {/* Text */}
            <span className="ml-4 text-lg font-medium text-gray-300">
                Trusted by <span className="font-semibold">10+</span> people
            </span>
        </div>
    );
};

export default People;

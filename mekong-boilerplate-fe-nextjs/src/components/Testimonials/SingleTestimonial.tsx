import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const starIcon = (
  <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current">
    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
  </svg>
);

const SingleTestimonial = ({ testimonial }: { testimonial: Testimonial }) => {
  const { star, name, image, content, designation } = testimonial;

  let ratingIcons = [];
  for (let index = 0; index < star; index++) {
    ratingIcons.push(
      <span key={index} className="text-yellow">
        {starIcon}
      </span>,
    );
  }

  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div
        className="relative h-full wow fadeInUp rounded-[28px] bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 group-hover:bg-white/[0.05]"
        data-wow-delay=".1s"
      >
        <div className="mb-6 flex items-center space-x-1">
          {ratingIcons}
        </div>
        
        <p className="mb-8 text-lg font-medium italic leading-relaxed text-black dark:text-white/90">
          "{content}"
        </p>
        
        <div className="flex items-center pt-8 border-t border-black/5 dark:border-white/10">
          <div className="relative mr-4 h-14 w-14 overflow-hidden rounded-full border-2 border-primary/20 p-0.5">
            <Image 
              src={image} 
              alt={name} 
              fill 
              className="rounded-full object-cover"
              style={{ objectPosition: testimonial.imagePosition || 'center' }}
            />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-black dark:text-white leading-tight mb-1">
              {name}
            </h3>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest opacity-80">
              {designation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestimonial;

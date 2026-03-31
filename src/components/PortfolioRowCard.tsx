import Image from "next/image";
import "../app/styles/portfolioRowCard.css";

interface PortfolioRowCardProps {
  title: string;
  image: string;
  description: string;
}

export default function PortfolioRowCard({
  title,
  image,
  description,
}: PortfolioRowCardProps) {
  return (
    <article className="portfolioRowCard">
      <div className="portfolioRowCard__imageWrapper">
        <Image
          src={image}
          alt={title}
          fill
          className="portfolioRowCard__image"
        />
      </div>
      <div className="portfolioRowCard__content">
        <h4 className="portfolioRowCard__title">{title}</h4>
        <p className="portfolioRowCard__description">{description}</p>
        <button className="portfolioRowCard__button" type="button">
          View Details
        </button>
      </div>
    </article>
  );
}

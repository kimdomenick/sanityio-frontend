import Image from "next/image";
import "../styles/portfolioCard.css";

interface PortfolioCardProps {
  title: string;
  image: string;
  description: string;
}

export default function PortfolioCard({
  title,
  image,
  description,
}: PortfolioCardProps) {
  return (
    <article className="portfolioCard">
      <div className="portfolioCard__imageWrapper">
        <Image
          src={image}
          alt={title}
          fill
          className="portfolioCard__image"
        />
      </div>
      <div className="portfolioCard__content">
        <h3 className="portfolioCard__title">{title}</h3>
        <p className="portfolioCard__description">{description}</p>
        <button className="portfolioCard__button" type="button">
          View Details
        </button>
      </div>
    </article>
  );
}

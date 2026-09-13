type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

const PageHeader = ({ eyebrow, title, description }: PageHeaderProps) => (
  <div className="page-header">
    {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
    <h1>{title}</h1>
    {description ? <p>{description}</p> : null}
  </div>
);

export default PageHeader;

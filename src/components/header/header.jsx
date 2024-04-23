export default function Header({ title, subtitle }) {
  return (
    <div>
      <div className="header">
        <div className="is-size-3">
          <strong>{title}</strong>
        </div>
        <div>{subtitle}</div>
      </div>
    </div>
  );
}

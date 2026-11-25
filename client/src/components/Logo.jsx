export default function Logo({ size = 19, color }) {
  return (
    <div className="logo" style={color ? { color } : undefined}>
      <div className="mark" />
      <span style={{ fontSize: size }}>KanFlow</span>
    </div>
  );
}

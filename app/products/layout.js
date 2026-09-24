import Protected from "../../components/Protected";
import Header from "../../components/Header";

export default function ProductsLayout({ children }) {
  return (
    <Protected>
      <Header />
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </Protected>
  );
}

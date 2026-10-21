import Document from '../document';

export default function PersianLayout({ children }: { children: React.ReactNode }) {
  return <Document locale="fa">{children}</Document>;
}

import Studio from '../studio';
import { metadataFor } from '../site-metadata';

export const metadata = metadataFor('en');
export default function Home() { return <Studio locale="en" />; }

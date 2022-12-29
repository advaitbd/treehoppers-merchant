import Link from 'next/link'
import { useRouter } from 'next/router';

export default function Example() {
    const router = useRouter();
    
    return (
    <>
      <nav className="bg-white py-6 flex items-center justify-center">
        <Link href="/" legacyBehavior>
          <a className={`px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100 transition-all ${router.pathname === '/' ? 'text-gray-800 font-bold' : 'text-gray-600'}`}>Dashboard</a>
        </Link>

        <Link href="/pending" legacyBehavior>
          <a className={`px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-100 transition-all ${router.pathname === '/pending' ? 'text-gray-800 font-bold' : 'text-gray-600'}`}>Pending Claims</a>
        </Link>

      </nav>
    </>
    );
}

import React from 'react';

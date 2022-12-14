import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import { useUserContentful } from '../hooks/useUserContentful';

export const Navigation = () => {
  const { user } = useUser();
  const { userContentful } = useUserContentful();
  return (
    <nav className='navbar navbar-light'>
      <div className='container'>
        <Link href='/'>
          <a className='navbar-brand'>conduit</a>
        </Link>
        <ul className='nav navbar-nav pull-xs-right'>
          <li className='nav-item'>
            <Link href='/'>
              <a className='nav-link active'>Home</a>
            </Link>
          </li>
          {user && (
            <>
              <li className='nav-item'>
                <Link href='/editor'>
                  <a className='nav-link'>
                    <i className='ion-compose'></i>&nbsp;New Article
                  </a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/settings'>
                  <a className='nav-link'>
                    <i className='ion-gear-a'></i>&nbsp;Settings
                  </a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href={`/authors/${user.nickname}`}>
                  <a className='nav-link' style={{ display: 'flex' }}>
                    {userContentful?.image && (
                      <Image
                        src={userContentful?.image}
                        height='26'
                        width='26'
                        alt={user.nickname}
                      />
                    )}
                    &nbsp;{user.nickname}
                  </a>
                </Link>
              </li>
            </>
          )}
          {!user && (
            <>
              <li className='nav-item'>
                <Link href='/api/auth/login'>
                  <a className='nav-link'>Sign in</a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/api/auth/login'>
                  <a className='nav-link'>Sign up</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

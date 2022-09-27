import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

export const Navigation = () => {
  const { user } = useUser();
  console.log(user);
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
                <Link href='/'>
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
                <Link href={`/@${user.name}`}>
                  <a className='nav-link'>
                    <i className='ion-gear-a'></i>&nbsp;{user.name}
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

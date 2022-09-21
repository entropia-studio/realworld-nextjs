import Link from 'next/link';

export const Navigation = () => {
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
          <li className='nav-item'>
            <Link href='/'>
              <a className='nav-link'>
                <i className='ion-compose'></i>&nbsp;New Article
              </a>
            </Link>
          </li>
          <li className='nav-item'>
            <Link href='/'>
              <a className='nav-link'>
                <i className='ion-gear-a'></i>&nbsp;Settings
              </a>
            </Link>
          </li>
          <li className='nav-item'>
            <Link href='/'>
              <a className='nav-link' href='/'>
                Sign in
              </a>
            </Link>
          </li>
          <li className='nav-item'>
            <Link href='/'>
              <a className='nav-link' href='/'>
                Sign up
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

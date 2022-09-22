import React from 'react';
import { Layout } from '../components/Layout';
import { useUser } from '@auth0/nextjs-auth0';

export default function Login() {
  const { user, error, isLoading } = useUser();

  return (
    <Layout>
      <div class='auth-page'>
        <div class='container page'>
          <div class='row'>
            <div class='col-md-6 offset-md-3 col-xs-12'>
              <h1 class='text-xs-center'>Sign up</h1>
              <p class='text-xs-center'>
                <a href=''>Have an account?</a>
              </p>

              <ul class='error-messages'>
                <li>That email is already taken</li>
              </ul>

              <form>
                <fieldset class='form-group'>
                  <input
                    class='form-control form-control-lg'
                    type='text'
                    placeholder='Username'
                  />
                </fieldset>
                <fieldset class='form-group'>
                  <input
                    class='form-control form-control-lg'
                    type='text'
                    placeholder='Email'
                  />
                </fieldset>
                <fieldset class='form-group'>
                  <input
                    class='form-control form-control-lg'
                    type='password'
                    placeholder='Password'
                  />
                </fieldset>
                <button class='btn btn-lg btn-primary pull-xs-right'>
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

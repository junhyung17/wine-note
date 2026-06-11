import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0f0a0c] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          🍷 <span className="text-[#d4af6a]">Vin</span>Note
        </h1>
        <p className="text-gray-500 mt-2 text-sm">나만의 와인 테이스팅 노트</p>
      </div>

      <div className="bg-[#140c0f] border border-[#2a1520] rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div>
          <h2 className="text-white font-semibold text-lg">로그인</h2>
          <p className="text-gray-500 text-sm mt-1">
            구글 계정으로 로그인하면 어디서든 같은 와인 기록을 볼 수 있어요.
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(response) => {
              if (response.credential) login(response.credential);
            }}
            onError={() => alert('로그인에 실패했습니다. 다시 시도해주세요.')}
            useOneTap
            shape="rectangular"
            theme="filled_black"
            text="signin_with"
            locale="ko"
          />
        </div>
      </div>
    </div>
  );
}

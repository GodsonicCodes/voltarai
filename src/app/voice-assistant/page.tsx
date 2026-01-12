import { redirect } from 'next/navigation';

const Page = () => {
  // Redirect to home page since voice assistant is disabled
  redirect('/');
  
  // Alternative: return a message
  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-black text-white">
  //     <div className="text-center">
  //       <h1 className="text-2xl font-bold mb-4">Voice Assistant Temporarily Unavailable</h1>
  //       <p>The voice assistant feature is currently disabled.</p>
  //     </div>
  //   </div>
  // );
}

export default Page;
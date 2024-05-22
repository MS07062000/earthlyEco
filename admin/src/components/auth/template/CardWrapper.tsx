import { Card, CardContent, CardHeader } from "@/components/ui/card"; // CardFooter,
import Header from '@/components/auth/atoms/Header'
// import { BackButton } from '@/components/auth/back-button'
// import Social from '@/components/auth/social'

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
}: 
// backButtonHref,
// backButtonLabel,
// showSocial,
CardWrapperProps) => {
  return (
    <Card className="w-[800px] md:w-[400px] shadow-2xl">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {/* {showSocial && (
        <CardFooter className='flex flex-col justify-center'>
          <p className='text-xs mb-4 text-center truncate'>or continue with</p>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter> */}
    </Card>
  );
};

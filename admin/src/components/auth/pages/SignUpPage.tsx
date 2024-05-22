// import { CardWrapper } from '@/components/auth/card-wrapper'
// import { useForm } from 'react-hook-form'
// import { useEffect, useState } from 'react'
// import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormLabel,
//   FormItem,
//   FormMessage,
// } from '@/components/ui/form'

// import { Input } from '@/components/ui/input'

// import * as z from 'zod'
// import { RegisterSchema } from '@/schemas/index'
// import { Button } from '@/components/ui/button'
// import { FormError } from '@/components/forms/form-error'
// import { FormSuccess } from '@/components/forms/form-success'
// import { useAppSelector, useAppDispatch } from '@/hooks/apphook'
// import { loginWithEmailAndPassword } from '@/store/actions/authActions'
// import { error } from 'console'
// import { useNavigate } from 'react-router-dom'

// export const SignupPage = () => {
//   const auth = useAppSelector((state) => state.auth);
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const form = useForm<z.infer<typeof RegisterSchema>>({
//     resolver: zodResolver(RegisterSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   })

//   const onSubmit = () => {
//     dispatch(
//       signUpWithEmailAndPassword(form.getValues().email, form.getValues().password)
//     );
//   }

//   useEffect(() => {
//     if (auth.user !== null) {
//       navigate("/", { replace: true });
//     }
//   }, [auth]);

  
//   return (
//     <CardWrapper
//       headerLabel='Create an account'
//       backButtonLabel='Already have an account?'
//       backButtonHref='/signin'
//       showSocial
//     >
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className='space-y-6'
//           noValidate
//         >
//           <div className='space-y-4'>
//             <FormField
//               control={form.control}
//               name='email'
//               render={({ field }) => {
//                 return (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={form.formState.isSubmitting}
//                         placeholder='example@example.com'
//                         type='email'
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )
//               }}
//             />
//             <FormField
//               control={form.control}
//               name='password'
//               render={({ field }) => {
//                 return (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder='********'
//                         type='password'
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )
//               }}
//             />
//           </div>
//           <FormError message={error} />
//           <FormSuccess message={Success} />
//           <Button
//             type='submit'
//             disabled={form.formState.isSubmitting}
//             className='w-full'
//           >
//             Register
//           </Button>
//         </form>
//       </Form>
//     </CardWrapper>
//   )
// }

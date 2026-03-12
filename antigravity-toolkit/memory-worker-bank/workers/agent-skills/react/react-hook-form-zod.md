# react-hook-form-zod
Source: https://antigravity.codes/agent-skills/react/react-hook-form-zod

## AI Worker Instructions
When the user requests functionality related to react-hook-form-zod, follow these guidelines and utilize this context.

## Scraped Content

# react-hook-form-zod
```
npm install react-hook-form@7.70.0 zod@4.3.5 @hookform/resolvers@5.2.2
```
```
npm install react-hook-form@7.70.0 zod@4.3.5 @hookform/resolvers@5.2.2
```
```
const schema = z.object({  email: z.string().email(),  password: z.string().min(8),})type FormData = z.infer<typeof schema>const { register, handleSubmit, formState: { errors } } = useForm<FormData>({  resolver: zodResolver(schema),  defaultValues: { email: '', password: '' }, // REQUIRED to prevent uncontrolled warnings})<form onSubmit={handleSubmit(onSubmit)}>  <input {...register('email')} />  {errors.email && <span role="alert">{errors.email.message}</span>}</form>
```
```
const schema = z.object({  email: z.string().email(),  password: z.string().min(8),})type FormData = z.infer<typeof schema>const { register, handleSubmit, formState: { errors } } = useForm<FormData>({  resolver: zodResolver(schema),  defaultValues: { email: '', password: '' }, // REQUIRED to prevent uncontrolled warnings})<form onSubmit={handleSubmit(onSubmit)}>  <input {...register('email')} />  {errors.email && <span role="alert">{errors.email.message}</span>}</form>
```
```
// SAME schema on serverconst data = schema.parse(await req.json())
```
```
// SAME schema on serverconst data = schema.parse(await req.json())
```
```
mode: 'onSubmit'
```
```
mode: 'onBlur'
```
```
mode: 'onChange'
```
```
shouldUnregister: true
```
```
z.object({ password: z.string(), confirm: z.string() })  .refine((data) => data.password === data.confirm, {    message: "Passwords don't match",    path: ['confirm'], // CRITICAL: Error appears on this field  })
```
```
z.object({ password: z.string(), confirm: z.string() })  .refine((data) => data.password === data.confirm, {    message: "Passwords don't match",    path: ['confirm'], // CRITICAL: Error appears on this field  })
```
```
z.string().transform((val) => val.toLowerCase()) // Data manipulationz.string().transform(parseInt).refine((v) => v > 0) // Chain with refine
```
```
z.string().transform((val) => val.toLowerCase()) // Data manipulationz.string().transform(parseInt).refine((v) => v > 0) // Chain with refine
```
```
// Exact optional (can omit field, but NOT undefined)z.string().exactOptional()// Exclusive union (exactly one must match)z.xor([z.string(), z.number()])// Import from JSON Schemaz.fromJSONSchema({ type: "object", properties: { name: { type: "string" } } })
```
```
// Exact optional (can omit field, but NOT undefined)z.string().exactOptional()// Exclusive union (exactly one must match)z.xor([z.string(), z.number()])// Import from JSON Schemaz.fromJSONSchema({ type: "object", properties: { name: { type: "string" } } })
```
```
<input {...register('email')} /> // Uncontrolled, best performance
```
```
<input {...register('email')} /> // Uncontrolled, best performance
```
```
<Controller  name="category"  control={control}  render={({ field }) => <CustomSelect {...field} />} // MUST spread {...field}/>
```
```
<Controller  name="category"  control={control}  render={({ field }) => <CustomSelect {...field} />} // MUST spread {...field}/>
```
```
register
```
```
{errors.email && <span role="alert">{errors.email.message}</span>}{errors.address?.street?.message} // Nested errors (use optional chaining)
```
```
{errors.email && <span role="alert">{errors.email.message}</span>}{errors.address?.street?.message} // Nested errors (use optional chaining)
```
```
const onSubmit = async (data) => {  const res = await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) })  if (!res.ok) {    const { errors: serverErrors } = await res.json()    Object.entries(serverErrors).forEach(([field, msg]) => setError(field, { message: msg }))  }}
```
```
const onSubmit = async (data) => {  const res = await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) })  if (!res.ok) {    const { errors: serverErrors } = await res.json()    Object.entries(serverErrors).forEach(([field, msg]) => setError(field, { message: msg }))  }}
```
```
const { fields, append, remove } = useFieldArray({ control, name: 'contacts' }){fields.map((field, index) => (  <div key={field.id}> {/* CRITICAL: Use field.id, NOT index */}    <input {...register(contacts.${index}.name as const)} />    {errors.contacts?.[index]?.name && <span>{errors.contacts[index].name.message}</span>}    <button onClick={() => remove(index)}>Remove</button>  </div>))}<button onClick={() => append({ name: '', email: '' })}>Add</button>
```
```
const { fields, append, remove } = useFieldArray({ control, name: 'contacts' }){fields.map((field, index) => (  <div key={field.id}> {/* CRITICAL: Use field.id, NOT index */}    <input {...register(contacts.${index}.name as const)} />    {errors.contacts?.[index]?.name && <span>{errors.contacts[index].name.message}</span>}    <button onClick={() => remove(index)}>Remove</button>  </div>))}<button onClick={() => append({ name: '', email: '' })}>Add</button>
```
```
contacts.${index}.name
```
```
const debouncedValidation = useDebouncedCallback(() => trigger('username'), 500)
```
```
const debouncedValidation = useDebouncedCallback(() => trigger('username'), 500)
```
```
const step1 = z.object({ name: z.string(), email: z.string().email() })const step2 = z.object({ address: z.string() })const fullSchema = step1.merge(step2)const nextStep = async () => {  const isValid = await trigger(['name', 'email']) // Validate specific fields  if (isValid) setStep(2)}
```
```
const step1 = z.object({ name: z.string(), email: z.string().email() })const step2 = z.object({ address: z.string() })const fullSchema = step1.merge(step2)const nextStep = async () => {  const isValid = await trigger(['name', 'email']) // Validate specific fields  if (isValid) setStep(2)}
```
```
z.discriminatedUnion('accountType', [  z.object({ accountType: z.literal('personal'), name: z.string() }),  z.object({ accountType: z.literal('business'), companyName: z.string() }),])
```
```
z.discriminatedUnion('accountType', [  z.object({ accountType: z.literal('personal'), name: z.string() }),  z.object({ accountType: z.literal('business'), companyName: z.string() }),])
```
```
const form = useForm({  resolver: zodResolver(schema),  shouldUnregister: false, // Keep values when fields unmount (default)})// Or use conditional schema validation:z.object({  showAddress: z.boolean(),  address: z.string(),}).refine((data) => {  if (data.showAddress) {    return data.address.length > 0;  }  return true;}, {  message: "Address is required",  path: ["address"],})
```
```
const form = useForm({  resolver: zodResolver(schema),  shouldUnregister: false, // Keep values when fields unmount (default)})// Or use conditional schema validation:z.object({  showAddress: z.boolean(),  address: z.string(),}).refine((data) => {  if (data.showAddress) {    return data.address.length > 0;  }  return true;}, {  message: "Address is required",  path: ["address"],})
```
```
Form
```
```
// ✅ Correct:import { useForm } from "react-hook-form";import { Form, FormField, FormItem } from "@/components/ui/form"; // shadcn// ❌ Wrong (auto-import mistake):import { useForm, Form } from "react-hook-form";
```
```
// ✅ Correct:import { useForm } from "react-hook-form";import { Form, FormField, FormItem } from "@/components/ui/form"; // shadcn// ❌ Wrong (auto-import mistake):import { useForm, Form } from "react-hook-form";
```
```
<FormField control={form.control} name="username" render={({ field }) => (  <FormItem>    <FormControl><Input {...field} /></FormControl>    <FormMessage />  </FormItem>)} />
```
```
<FormField control={form.control} name="username" render={({ field }) => (  <FormItem>    <FormControl><Input {...field} /></FormControl>    <FormMessage />  </FormItem>)} />
```
```
register
```
```
Controller
```
```
watch('email')
```
```
watch()
```
```
shouldUnregister: true
```
```
formState
```
```
// ❌ Slow with 300+ fields:const { isDirty, isValid } = form.formState;// ✅ Fast:const handleSubmit = () => {  if (!form.formState.isValid) return; // Read inline only when needed};
```
```
// ❌ Slow with 300+ fields:const { isDirty, isValid } = form.formState;// ✅ Fast:const handleSubmit = () => {  if (!form.formState.isValid) return; // Read inline only when needed};
```
```
const form = useForm({  resolver: zodResolver(largeSchema),  mode: "onSubmit", // Validate only on submit, not onChange});
```
```
const form = useForm({  resolver: zodResolver(largeSchema),  mode: "onSubmit", // Validate only on submit, not onChange});
```
```
// Instead of one 300-field form, use 5-6 forms with 50-60 fields eachconst form1 = useForm({ resolver: zodResolver(schema1) }); // Fields 1-50const form2 = useForm({ resolver: zodResolver(schema2) }); // Fields 51-100
```
```
// Instead of one 300-field form, use 5-6 forms with 50-60 fields eachconst form1 = useForm({ resolver: zodResolver(schema1) }); // Fields 1-50const form2 = useForm({ resolver: zodResolver(schema2) }); // Fields 51-100
```
```
// Only mount fields for active tab, reduces initial registration time{activeTab === 'personal' && <PersonalInfoFields />}{activeTab === 'address' && <AddressFields />}
```
```
// Only mount fields for active tab, reduces initial registration time{activeTab === 'personal' && <PersonalInfoFields />}{activeTab === 'address' && <AddressFields />}
```
```
field.id
```
```
{...field}
```
```
z.infer<typeof schema>
```
```
setValue()
```
```
z.infer<typeof schema>
```
```
import { z } from 'zod/v3'
```
```
defaultValues
```
```
errors.address?.street?.message
```
```
key={field.id}
```
```
setError()
```
```
defaultValues
```
```
{...field}
```
```
field.id
```
```
path
```
```
refine(..., { path: ['fieldName'] })
```
```
transform
```
```
preprocess
```
```
.optional()
```
```
""
```
```
.nullish()
```
```
.or(z.literal(""))
```
```
z.preprocess((val) => val === "" ? undefined : val, z.email().optional())
```
```
useFieldArray
```
```
string[]
```
```
[{ value: "string" }]
```
```
["string"]
```
```
key
```
```
form.reset()
```
```
setValue()
```
```
reset()
```
```
isValidating=false
```
```
errors
```
```
!errors.field && !isValidating
```
```
ZodError
```
```
formState.errors
```
```
Form
```
```
Form
```
```
@/components/ui/form
```
```
id
```
```
key
```
```
// V7:const { fields } = useFieldArray({ control, name: "items" });fields.map(field => <div key={field.id}>...</div>)// V8:const { fields } = useFieldArray({ control, name: "items" });fields.map(field => <div key={field.key}>...</div>)// keyName prop removed
```
```
// V7:const { fields } = useFieldArray({ control, name: "items" });fields.map(field => <div key={field.id}>...</div>)// V8:const { fields } = useFieldArray({ control, name: "items" });fields.map(field => <div key={field.key}>...</div>)// keyName prop removed
```
```
names
```
```
name
```
```
// V7:<Watch names={["email", "password"]} />// V8:<Watch name={["email", "password"]} />
```
```
// V7:<Watch names={["email", "password"]} />// V8:<Watch name={["email", "password"]} />
```
```
// V7:watch((data, { name, type }) => {  console.log(data, name, type);});// V8: Use useWatch or manual subscriptionconst data = useWatch({ control });useEffect(() => {  console.log(data);}, [data]);
```
```
// V7:watch((data, { name, type }) => {  console.log(data, name, type);});// V8: Use useWatch or manual subscriptionconst data = useWatch({ control });useEffect(() => {  console.log(data);}, [data]);
```
```
// V7:setValue("items", newArray); // Updates field array// V8: Must use replace() APIconst { replace } = useFieldArray({ control, name: "items" });replace(newArray);
```
```
// V7:setValue("items", newArray); // Updates field array// V8: Must use replace() APIconst { replace } = useFieldArray({ control, name: "items" });replace(newArray);
```
```
key
```
```
id
```
```
/* ❌ Causes uncontrolled→controlled warning */const { register } = useForm<FormData>({  resolver: zodResolver(schema),  // No defaultValues!})/* ✅ Always provide defaultValues */const { register } = useForm<FormData>({  resolver: zodResolver(schema),  defaultValues: {    name: '',    email: '',    age: undefined, // or appropriate default  },})
```
```
/* ❌ Causes uncontrolled→controlled warning */const { register } = useForm<FormData>({  resolver: zodResolver(schema),  // No defaultValues!})/* ✅ Always provide defaultValues */const { register } = useForm<FormData>({  resolver: zodResolver(schema),  defaultValues: {    name: '',    email: '',    age: undefined, // or appropriate default  },})
```
```
/* ❌ Using index causes infinite re-renders */{fields.map((field, index) => (  <input key={index} {...register(items.${index}.name)} />))}/* ✅ Use field.id */{fields.map((field, index) => (  <input key={field.id} {...register(items.${index}.name)} />))}
```
```
/* ❌ Using index causes infinite re-renders */{fields.map((field, index) => (  <input key={index} {...register(items.${index}.name)} />))}/* ✅ Use field.id */{fields.map((field, index) => (  <input key={field.id} {...register(items.${index}.name)} />))}
```
```
items.${index}.name
```
```
items.${index}.name
```
```
/* ❌ Field doesn't update */<Controller  name="status"  control={control}  render={({ field }) => (    <Select value={field.value} onChange={field.onChange} />  )}/>/* ✅ Spread all field props */<Controller  name="status"  control={control}  render={({ field }) => (    <Select {...field} />  )}/>
```
```
/* ❌ Field doesn't update */<Controller  name="status"  control={control}  render={({ field }) => (    <Select value={field.value} onChange={field.onChange} />  )}/>/* ✅ Spread all field props */<Controller  name="status"  control={control}  render={({ field }) => (    <Select {...field} />  )}/>
```
```
/* ❌ May crash on undefined */errors.address.street.message/* ✅ Use optional chaining */errors.address?.street?.message
```
```
/* ❌ May crash on undefined */errors.address.street.message/* ✅ Use optional chaining */errors.address?.street?.message
```
```
/* ❌ Security vulnerability - client only */const onSubmit = (data) => {  await api.post('/users', data) // No server validation!}/* ✅ Validate on BOTH client and server */// Client: useForm with zodResolver// Server:app.post('/users', async (c) => {  const result = schema.safeParse(await c.req.json())  if (!result.success) {    return c.json({ errors: result.error.flatten() }, 400)  }})
```
```
/* ❌ Security vulnerability - client only */const onSubmit = (data) => {  await api.post('/users', data) // No server validation!}/* ✅ Validate on BOTH client and server */// Client: useForm with zodResolver// Server:app.post('/users', async (c) => {  const result = schema.safeParse(await c.req.json())  if (!result.success) {    return c.json({ errors: result.error.flatten() }, 400)  }})
```
```
/* ✅ Display server validation errors */const onSubmit = async (data) => {  const response = await api.post('/users', data)  if (!response.ok) {    const { errors } = await response.json()    // Set field-specific errors    Object.entries(errors).forEach(([field, message]) => {      setError(field, { message })    })  }}
```
```
/* ✅ Display server validation errors */const onSubmit = async (data) => {  const response = await api.post('/users', data)  if (!response.ok) {    const { errors } = await response.json()    // Set field-specific errors    Object.entries(errors).forEach(([field, message]) => {      setError(field, { message })    })  }}
```
```
/* ❌ Error shows on form, not field */const schema = z.object({  password: z.string(),  confirm: z.string(),}).refine(d => d.password === d.confirm, {  message: "Passwords don't match",})/* ✅ Include path for field placement */const schema = z.object({  password: z.string(),  confirm: z.string(),}).refine(d => d.password === d.confirm, {  message: "Passwords don't match",  path: ['confirm'], // Error shows on confirm field})
```
```
/* ❌ Error shows on form, not field */const schema = z.object({  password: z.string(),  confirm: z.string(),}).refine(d => d.password === d.confirm, {  message: "Passwords don't match",})/* ✅ Include path for field placement */const schema = z.object({  password: z.string(),  confirm: z.string(),}).refine(d => d.password === d.confirm, {  message: "Passwords don't match",  path: ['confirm'], // Error shows on confirm field})
```
```
defaultValues
```
```
defaultValues: { field: '' }
```
```
key={index}
```
```
key={field.id}
```
```
{...field}
```
```
errors.a.b.message
```
```
errors.a?.b?.message
```
```
path: ['fieldName']
```
Leverage the power of AI to streamline your form development with React Hook Form and Zod. This skill set empowers you to build highly robust and type-safe forms, ensuring data integrity from user input to backend processing. By combining efficient form management with powerful schema validation, developers can significantly reduce boilerplate, prevent common data errors, and enhance user experience. It's an an essential tool for crafting modern, reliable web applications with your AI coding assistant, enabling quick implementation of complex validation logic.

# When to Use This Skill
- •Implementing robust user registration and login forms with real-time feedback.
- •Building complex data entry forms that require strict schema validation for multiple fields.
- •Ensuring consistent client-side and server-side validation for critical application data.
- •Developing forms with dynamic inputs where validation rules might change based on user interaction.

# Pro Tips
- 💡Always define `defaultValues` in `useForm` options to prevent 'uncontrolled component' warnings and ensure predictable form state, especially during resets.
- 💡Utilize `mode: 'onBlur'` for a good balance between performance and user feedback, reserving `'onChange'` for highly interactive fields where immediate validation is crucial.
- 💡Crucially, mirror your Zod schema on the server-side as well to guarantee data integrity and prevent malicious submissions, even if client-side validation passes.


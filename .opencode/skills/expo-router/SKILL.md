---
name: expo-router
description: Guidance for navigating, structuring routes, and passing params in Expo Router.
---

## What I do
+ file based routing

## When to use me
+ Use this for changes inside app/ (layouts, route groups, dynamic routes, links, typed routes, and URL params).

## High level rules
+ Routes are files/folders inside `/src/app/`. Each screen is a file exporting a default component.
+ Layout is defined by `_layout.tsx` inside a directory and wraps the pages in that folder. The layout returns a navigator  (Stack/Tabs/Redirect).
+ Keep route components “thin”: route file reads params + wires dependencies, then renders a feature/screen component from `src/components`.

## Stack Navigator
### Navigation
For navigation you can use the ~Link~ component from expo-router or ~useRouter~.

You can `push`, `replace`, and `dismissTo`. These are parameters for the `Link` component and methods on the `router` object from `useRouter`. Prefer `Link` over `useRouter`.

```typescript
<Link href="/" dismissTo>
  Index Page
</Link>
```
### Passing Parameters
Parameters have to be serializable (functions aren't allowed).

You can provide a object to the router from `useRouter` and to the `href`  from `Link`.

```typescript
<Link href={{pathname: "/my-page", params: { id: 42}}} push></Link>

<Pressable onPress={() => router.push({pathname: "/third-page", params: { id: 42}})}></Pressable>
```

### Dynamic Routes
Dynamic routes are created by wrapping the directory name or the file name in square brackets (for example: [id].tsx). You can read the provided dynamic route with `useLocalSearchParams`.

```typescript
// [id].tsx

//...

export default function Page() {
  const local = useLocalSearchParams();
  return (
    <View>
      <Text>{local.id}</Text>
    </View>
  );
}
```

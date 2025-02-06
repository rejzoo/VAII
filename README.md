# Seal clubber
Seal clubber is a web app for a game called [World of Tanks](https://worldoftanks.eu/) in which user can ingame statistics and tank information.
World of Tanks has a lot of statistics and values some of which are hidden to the player and can only be
accessed via World of Tanks official API. A lot of players including me are interested in knowing these values and also statistics which can tell how well is the player performing or how well should one perform.
<p align="center">
  <img src="https://github.com/user-attachments/assets/1f32a986-dc5f-4271-874f-aab92751adc5" alt="wn8table" width="400" />
  <br>XVM (WN8) boundaries TODO
</p>

## Pages on the website
- ADMIN (Hidden)
- Profile (Hidden)
- Home
- Tanks
- Servers
- Mastery
- MOE
  
## API for data
Data for the web app will be from the official World of Tanks [API](https://developers.wargaming.net/reference/all/wot/account/list/?r_realm=eu) (hopefully)

# Start up
### Prerequisites
Make sure you have Node.js (v20 or later) installed. If you don’t have it, download it from [nodejs.org](https://nodejs.org/).


```sh
git clone https://github.com/rejzoo/VAII
cd VAII
```

### Install dependencies

```sh
npm install
```

### 📦 Installed Dependencies
#### Runtime Dependencies
- @fortawesome/free-solid-svg-icons – Icon set from Font Awesome.
- @fortawesome/react-fontawesome – React components for Font Awesome icons.
- @supabase/ssr – Supabase server-side rendering integration.
- @supabase/supabase-js – Supabase client for data access.
- chart.js – Library for building charts.
- next – React framework for SSR and static site generation.
- react – React library.
- react-chartjs-2 – React wrapper for Chart.js.
- react-dom – React DOM rendering

#### Development Dependencies
- @types/node – Node.js type definitions.
- @types/react – React type definitions.
- @types/react-dom – React DOM type definitions.
- eslint – Linting tool for code quality.
- tailwindcss – Utility-first CSS framework.
- typescript – TypeScript language support.


### Environment Variables
Create a .env.local file in the root directory and configure it with your project’s credentials.
```typescript
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
WARGAMING_API_KEY=your_wargaming_api_key
```
<b>Warning keep your keys secret.</b>

### Run the server
```sh
npm run dev
```
Then open your browser at http://localhost:3000 to see the project in action.
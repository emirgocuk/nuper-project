# remotion-best-practices
Source: https://antigravity.codes/agent-skills/react/remotion

## AI Worker Instructions
When the user requests functionality related to remotion-best-practices, follow these guidelines and utilize this context.

## Scraped Content

# remotion-best-practices
```
@remotion/three
```
```
npx remotion add @remotion/three # If project uses npmbunx remotion add @remotion/three # If project uses bunyarn remotion add @remotion/three # If project uses yarnpnpm exec remotion add @remotion/three # If project uses pnpm
```
```
npx remotion add @remotion/three # If project uses npmbunx remotion add @remotion/three # If project uses bunyarn remotion add @remotion/three # If project uses yarnpnpm exec remotion add @remotion/three # If project uses pnpm
```
```
<ThreeCanvas>
```
```
<ThreeCanvas>
```
```
width
```
```
height
```
```
import { ThreeCanvas } from "@remotion/three";import { useVideoConfig } from "remotion";const { width, height } = useVideoConfig();<ThreeCanvas width={width} height={height}>  <ambientLight intensity={0.4} />  <directionalLight position={[5, 5, 5]} intensity={0.8} />  <mesh>    <sphereGeometry args={[1, 32, 32]} />    <meshStandardMaterial color="red" />  </mesh></ThreeCanvas>
```
```
import { ThreeCanvas } from "@remotion/three";import { useVideoConfig } from "remotion";const { width, height } = useVideoConfig();<ThreeCanvas width={width} height={height}>  <ambientLight intensity={0.4} />  <directionalLight position={[5, 5, 5]} intensity={0.8} />  <mesh>    <sphereGeometry args={[1, 32, 32]} />    <meshStandardMaterial color="red" />  </mesh></ThreeCanvas>
```
```
useCurrentFrame()
```
```
useCurrentFrame()
```
```
useFrame()
```
```
@react-three/fiber
```
```
useCurrentFrame()
```
```
useCurrentFrame()
```
```
const frame = useCurrentFrame();const rotationY = frame * 0.02;<mesh rotation={[0, rotationY, 0]}>  <boxGeometry args={[2, 2, 2]} />  <meshStandardMaterial color="#4a9eff" /></mesh>
```
```
const frame = useCurrentFrame();const rotationY = frame * 0.02;<mesh rotation={[0, rotationY, 0]}>  <boxGeometry args={[2, 2, 2]} />  <meshStandardMaterial color="#4a9eff" /></mesh>
```
```
<Sequence>
```
```
<ThreeCanvas>
```
```
layout
```
```
<Sequence>
```
```
<ThreeCanvas>
```
```
none
```
```
import { Sequence } from "remotion";import { ThreeCanvas } from "@remotion/three";const { width, height } = useVideoConfig();<ThreeCanvas width={width} height={height}>  <Sequence layout="none">    <mesh>      <boxGeometry args={[2, 2, 2]} />      <meshStandardMaterial color="#4a9eff" />    </mesh>  </Sequence></ThreeCanvas>
```
```
import { Sequence } from "remotion";import { ThreeCanvas } from "@remotion/three";const { width, height } = useVideoConfig();<ThreeCanvas width={width} height={height}>  <Sequence layout="none">    <mesh>      <boxGeometry args={[2, 2, 2]} />      <meshStandardMaterial color="#4a9eff" />    </mesh>  </Sequence></ThreeCanvas>
```
```
useCurrentFrame()
```
```
fps
```
```
useVideoConfig()
```
```
import { useCurrentFrame } from "remotion";export const FadeIn = () => {  const frame = useCurrentFrame();  const { fps } = useVideoConfig();  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {    extrapolateRight: 'clamp',  });   return (    <div style={{ opacity }}>Hello World!</div>  );};
```
```
import { useCurrentFrame } from "remotion";export const FadeIn = () => {  const frame = useCurrentFrame();  const { fps } = useVideoConfig();  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {    extrapolateRight: 'clamp',  });   return (    <div style={{ opacity }}>Hello World!</div>  );};
```
```
public/
```
```
staticFile()
```
```
public/
```
```
import {Img, staticFile} from 'remotion';export const MyComposition = () => {  return <Img src={staticFile('logo.png')} />;};
```
```
import {Img, staticFile} from 'remotion';export const MyComposition = () => {  return <Img src={staticFile('logo.png')} />;};
```
```
import {Img, staticFile} from 'remotion';<Img src={staticFile('photo.png')} />;
```
```
import {Img, staticFile} from 'remotion';<Img src={staticFile('photo.png')} />;
```
```
import {Video} from '@remotion/media';import {staticFile} from 'remotion';<Video src={staticFile('clip.mp4')} />;
```
```
import {Video} from '@remotion/media';import {staticFile} from 'remotion';<Video src={staticFile('clip.mp4')} />;
```
```
import {Audio} from '@remotion/media';import {staticFile} from 'remotion';<Audio src={staticFile('music.mp3')} />;
```
```
import {Audio} from '@remotion/media';import {staticFile} from 'remotion';<Audio src={staticFile('music.mp3')} />;
```
```
import {staticFile} from 'remotion';const fontFamily = new FontFace('MyFont', url(${staticFile('font.woff2')}));await fontFamily.load();document.fonts.add(fontFamily);
```
```
import {staticFile} from 'remotion';const fontFamily = new FontFace('MyFont', url(${staticFile('font.woff2')}));await fontFamily.load();document.fonts.add(fontFamily);
```
```
url(${staticFile('font.woff2')})
```
```
staticFile()
```
```
<Img src="https://example.com/image.png" /><Video src="https://remotion.media/video.mp4" />
```
```
<Img src="https://example.com/image.png" /><Video src="https://remotion.media/video.mp4" />
```
```
<Img>
```
```
<Video>
```
```
<Audio>
```
```
#
```
```
?
```
```
&
```
```
npx remotion add @remotion/media # If project uses npmbunx remotion add @remotion/media # If project uses bunyarn remotion add @remotion/media # If project uses yarnpnpm exec remotion add @remotion/media # If project uses pnpm
```
```
npx remotion add @remotion/media # If project uses npmbunx remotion add @remotion/media # If project uses bunyarn remotion add @remotion/media # If project uses yarnpnpm exec remotion add @remotion/media # If project uses pnpm
```
```
<Audio>
```
```
@remotion/media
```
```
import { Audio } from "@remotion/media";import { staticFile } from "remotion";export const MyComposition = () => {  return <Audio src={staticFile("audio.mp3")} />;};
```
```
import { Audio } from "@remotion/media";import { staticFile } from "remotion";export const MyComposition = () => {  return <Audio src={staticFile("audio.mp3")} />;};
```
```
<Audio src="https://remotion.media/audio.mp3" />
```
```
<Audio src="https://remotion.media/audio.mp3" />
```
```
<Audio>
```
```
trimBefore
```
```
trimAfter
```
```
const { fps } = useVideoConfig();return (  <Audio    src={staticFile("audio.mp3")}    trimBefore={2 * fps} // Skip the first 2 seconds    trimAfter={10 * fps} // End at the 10 second mark  />);
```
```
const { fps } = useVideoConfig();return (  <Audio    src={staticFile("audio.mp3")}    trimBefore={2 * fps} // Skip the first 2 seconds    trimAfter={10 * fps} // End at the 10 second mark  />);
```
```
<Sequence>
```
```
import { Sequence, staticFile } from "remotion";import { Audio } from "@remotion/media";const { fps } = useVideoConfig();return (  <Sequence from={1 * fps}>    <Audio src={staticFile("audio.mp3")} />  </Sequence>);
```
```
import { Sequence, staticFile } from "remotion";import { Audio } from "@remotion/media";const { fps } = useVideoConfig();return (  <Sequence from={1 * fps}>    <Audio src={staticFile("audio.mp3")} />  </Sequence>);
```
```
<Audio src={staticFile("audio.mp3")} volume={0.5} />
```
```
<Audio src={staticFile("audio.mp3")} volume={0.5} />
```
```
import { interpolate } from "remotion";const { fps } = useVideoConfig();return (  <Audio    src={staticFile("audio.mp3")}    volume={(f) =>      interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })    }  />);
```
```
import { interpolate } from "remotion";const { fps } = useVideoConfig();return (  <Audio    src={staticFile("audio.mp3")}    volume={(f) =>      interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })    }  />);
```
```
f
```
```
muted
```
```
const frame = useCurrentFrame();const { fps } = useVideoConfig();return (  <Audio    src={staticFile("audio.mp3")}    muted={frame >= 2 * fps && frame <= 4 * fps} // Mute between 2s and 4s  />);
```
```
const frame = useCurrentFrame();const { fps } = useVideoConfig();return (  <Audio    src={staticFile("audio.mp3")}    muted={frame >= 2 * fps && frame <= 4 * fps} // Mute between 2s and 4s  />);
```
```
playbackRate
```
```
<Audio src={staticFile("audio.mp3")} playbackRate={2} /> {/* 2x speed */}<Audio src={staticFile("audio.mp3")} playbackRate={0.5} /> {/* Half speed */}
```
```
<Audio src={staticFile("audio.mp3")} playbackRate={2} /> {/* 2x speed */}<Audio src={staticFile("audio.mp3")} playbackRate={0.5} /> {/* Half speed */}
```
```
loop
```
```
<Audio src={staticFile("audio.mp3")} loop />
```
```
<Audio src={staticFile("audio.mp3")} loop />
```
```
loopVolumeCurveBehavior
```
```
"repeat"
```
```
"extend"
```
```
<Audio  src={staticFile("audio.mp3")}  loop  loopVolumeCurveBehavior="extend"  volume={(f) => interpolate(f, [0, 300], [1, 0])} // Fade out over multiple loops/>
```
```
<Audio  src={staticFile("audio.mp3")}  loop  loopVolumeCurveBehavior="extend"  volume={(f) => interpolate(f, [0, 300], [1, 0])} // Fade out over multiple loops/>
```
```
toneFrequency
```
```
<Audio  src={staticFile("audio.mp3")}  toneFrequency={1.5} // Higher pitch/><Audio  src={staticFile("audio.mp3")}  toneFrequency={0.8} // Lower pitch/>
```
```
<Audio  src={staticFile("audio.mp3")}  toneFrequency={1.5} // Higher pitch/><Audio  src={staticFile("audio.mp3")}  toneFrequency={0.8} // Lower pitch/>
```
```
<Player />
```
```
calculateMetadata
```
```
<Composition>
```
```
<Composition id="MyComp" component={MyComponent} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{videoSrc: 'https://remotion.media/video.mp4'}} calculateMetadata={calculateMetadata} />
```
```
<Composition id="MyComp" component={MyComponent} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{videoSrc: 'https://remotion.media/video.mp4'}} calculateMetadata={calculateMetadata} />
```
```
getMediaMetadata()
```
```
import {CalculateMetadataFunction} from 'remotion';import {getMediaMetadata} from '../get-media-metadata';const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  const {durationInSeconds} = await getMediaMetadata(props.videoSrc);  return {    durationInFrames: Math.ceil(durationInSeconds * 30),  };};
```
```
import {CalculateMetadataFunction} from 'remotion';import {getMediaMetadata} from '../get-media-metadata';const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  const {durationInSeconds} = await getMediaMetadata(props.videoSrc);  return {    durationInFrames: Math.ceil(durationInSeconds * 30),  };};
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  const {durationInSeconds, dimensions} = await getMediaMetadata(props.videoSrc);  return {    durationInFrames: Math.ceil(durationInSeconds * 30),    width: dimensions?.width ?? 1920,    height: dimensions?.height ?? 1080,  };};
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  const {durationInSeconds, dimensions} = await getMediaMetadata(props.videoSrc);  return {    durationInFrames: Math.ceil(durationInSeconds * 30),    width: dimensions?.width ?? 1920,    height: dimensions?.height ?? 1080,  };};
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  const metadataPromises = props.videos.map((video) => getMediaMetadata(video.src));  const allMetadata = await Promise.all(metadataPromises);  const totalDuration = allMetadata.reduce((sum, meta) => sum + meta.durationInSeconds, 0);  return {    durationInFrames: Math.ceil(totalDuration * 30),  };};
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  const metadataPromises = props.videos.map((video) => getMediaMetadata(video.src));  const allMetadata = await Promise.all(metadataPromises);  const totalDuration = allMetadata.reduce((sum, meta) => sum + meta.durationInSeconds, 0);  return {    durationInFrames: Math.ceil(totalDuration * 30),  };};
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  return {    defaultOutName: video-${props.id}.mp4,  };};
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props}) => {  return {    defaultOutName: video-${props.id}.mp4,  };};
```
```
video-${props.id}.mp4
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props, abortSignal}) => {  const response = await fetch(props.dataUrl, {signal: abortSignal});  const data = await response.json();  return {    props: {      ...props,      fetchedData: data,    },  };};
```
```
const calculateMetadata: CalculateMetadataFunction<Props> = async ({props, abortSignal}) => {  const response = await fetch(props.dataUrl, {signal: abortSignal});  const data = await response.json();  return {    props: {      ...props,      fetchedData: data,    },  };};
```
```
abortSignal
```
```
<Composition>
```
```
durationInFrames
```
```
width
```
```
height
```
```
fps
```
```
props
```
```
defaultOutName
```
```
defaultCodec
```
```
canDecode()
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const canDecode = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  try {    await input.getFormat();  } catch {    return false;  }  const videoTrack = await input.getPrimaryVideoTrack();  if (videoTrack && !(await videoTrack.canDecode())) {    return false;  }  const audioTrack = await input.getPrimaryAudioTrack();  if (audioTrack && !(await audioTrack.canDecode())) {    return false;  }  return true;};
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const canDecode = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  try {    await input.getFormat();  } catch {    return false;  }  const videoTrack = await input.getPrimaryVideoTrack();  if (videoTrack && !(await videoTrack.canDecode())) {    return false;  }  const audioTrack = await input.getPrimaryAudioTrack();  if (audioTrack && !(await audioTrack.canDecode())) {    return false;  }  return true;};
```
```
const src = "https://remotion.media/video.mp4";const isDecodable = await canDecode(src);if (isDecodable) {  console.log("Video can be decoded");} else {  console.log("Video cannot be decoded by this browser");}
```
```
const src = "https://remotion.media/video.mp4";const isDecodable = await canDecode(src);if (isDecodable) {  console.log("Video can be decoded");} else {  console.log("Video cannot be decoded by this browser");}
```
```
BlobSource
```
```
import { Input, ALL_FORMATS, BlobSource } from "mediabunny";export const canDecodeBlob = async (blob: Blob) => {  const input = new Input({    formats: ALL_FORMATS,    source: new BlobSource(blob),  });  // Same validation logic as above};
```
```
import { Input, ALL_FORMATS, BlobSource } from "mediabunny";export const canDecodeBlob = async (blob: Blob) => {  const input = new Input({    formats: ALL_FORMATS,    source: new BlobSource(blob),  });  // Same validation logic as above};
```
```
useCurrentFrame()
```
```
useCurrentFrame()
```
```
const STAGGER_DELAY = 5;const frame = useCurrentFrame();const {fps} = useVideoConfig();const bars = data.map((item, i) => {  const delay = i * STAGGER_DELAY;  const height = spring({    frame,    fps,    delay,    config: {damping: 200},  });  return <div style={{height: height * item.value}} />;});
```
```
const STAGGER_DELAY = 5;const frame = useCurrentFrame();const {fps} = useVideoConfig();const bars = data.map((item, i) => {  const delay = i * STAGGER_DELAY;  const height = spring({    frame,    fps,    delay,    config: {damping: 200},  });  return <div style={{height: height * item.value}} />;});
```
```
const frame = useCurrentFrame();const {fps} = useVideoConfig();const progress = interpolate(frame, [0, 100], [0, 1]);const circumference = 2 * Math.PI * radius;const segmentLength = (value / total) * circumference;const offset = interpolate(progress, [0, 1], [segmentLength, 0]);<circle r={radius} cx={center} cy={center} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={${segmentLength} ${circumference}} strokeDashoffset={offset} transform={rotate(-90 ${center} ${center})} />;
```
```
const frame = useCurrentFrame();const {fps} = useVideoConfig();const progress = interpolate(frame, [0, 100], [0, 1]);const circumference = 2 * Math.PI * radius;const segmentLength = (value / total) * circumference;const offset = interpolate(progress, [0, 1], [segmentLength, 0]);<circle r={radius} cx={center} cy={center} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={${segmentLength} ${circumference}} strokeDashoffset={offset} transform={rotate(-90 ${center} ${center})} />;
```
```
${segmentLength} ${circumference}
```
```
rotate(-90 ${center} ${center})
```
```
<Composition>
```
```
src/Root.tsx
```
```
import { Composition } from "remotion";import { MyComposition } from "./MyComposition";export const RemotionRoot = () => {  return (    <Composition      id="MyComposition"      component={MyComposition}      durationInFrames={100}      fps={30}      width={1080}      height={1080}    />  );};
```
```
import { Composition } from "remotion";import { MyComposition } from "./MyComposition";export const RemotionRoot = () => {  return (    <Composition      id="MyComposition"      component={MyComposition}      durationInFrames={100}      fps={30}      width={1080}      height={1080}    />  );};
```
```
defaultProps
```
```
Date
```
```
Map
```
```
Set
```
```
staticFile()
```
```
import { Composition } from "remotion";import { MyComposition, MyCompositionProps } from "./MyComposition";export const RemotionRoot = () => {  return (    <Composition      id="MyComposition"      component={MyComposition}      durationInFrames={100}      fps={30}      width={1080}      height={1080}      defaultProps={{        title: "Hello World",        color: "#ff0000",      } satisfies MyCompositionProps}    />  );};
```
```
import { Composition } from "remotion";import { MyComposition, MyCompositionProps } from "./MyComposition";export const RemotionRoot = () => {  return (    <Composition      id="MyComposition"      component={MyComposition}      durationInFrames={100}      fps={30}      width={1080}      height={1080}      defaultProps={{        title: "Hello World",        color: "#ff0000",      } satisfies MyCompositionProps}    />  );};
```
```
type
```
```
interface
```
```
defaultProps
```
```
<Folder>
```
```
import { Composition, Folder } from "remotion";export const RemotionRoot = () => {  return (    <>      <Folder name="Marketing">        <Composition id="Promo" /* ... */ />        <Composition id="Ad" /* ... */ />      </Folder>      <Folder name="Social">        <Folder name="Instagram">          <Composition id="Story" /* ... */ />          <Composition id="Reel" /* ... */ />        </Folder>      </Folder>    </>  );};
```
```
import { Composition, Folder } from "remotion";export const RemotionRoot = () => {  return (    <>      <Folder name="Marketing">        <Composition id="Promo" /* ... */ />        <Composition id="Ad" /* ... */ />      </Folder>      <Folder name="Social">        <Folder name="Instagram">          <Composition id="Story" /* ... */ />          <Composition id="Reel" /* ... */ />        </Folder>      </Folder>    </>  );};
```
```
<Still>
```
```
durationInFrames
```
```
fps
```
```
import { Still } from "remotion";import { Thumbnail } from "./Thumbnail";export const RemotionRoot = () => {  return (    <Still      id="Thumbnail"      component={Thumbnail}      width={1280}      height={720}    />  );};
```
```
import { Still } from "remotion";import { Thumbnail } from "./Thumbnail";export const RemotionRoot = () => {  return (    <Still      id="Thumbnail"      component={Thumbnail}      width={1280}      height={720}    />  );};
```
```
calculateMetadata
```
```
import { Composition, CalculateMetadataFunction } from "remotion";import { MyComposition, MyCompositionProps } from "./MyComposition";const calculateMetadata: CalculateMetadataFunction<MyCompositionProps> = async ({  props,  abortSignal,}) => {  const data = await fetch(https://api.example.com/video/${props.videoId}, {    signal: abortSignal,  }).then((res) => res.json());  return {    durationInFrames: Math.ceil(data.duration * 30),    props: {      ...props,      videoUrl: data.url,    },  };};export const RemotionRoot = () => {  return (    <Composition      id="MyComposition"      component={MyComposition}      durationInFrames={100} // Placeholder, will be overridden      fps={30}      width={1080}      height={1080}      defaultProps={{ videoId: "abc123" }}      calculateMetadata={calculateMetadata}    />  );};
```
```
import { Composition, CalculateMetadataFunction } from "remotion";import { MyComposition, MyCompositionProps } from "./MyComposition";const calculateMetadata: CalculateMetadataFunction<MyCompositionProps> = async ({  props,  abortSignal,}) => {  const data = await fetch(https://api.example.com/video/${props.videoId}, {    signal: abortSignal,  }).then((res) => res.json());  return {    durationInFrames: Math.ceil(data.duration * 30),    props: {      ...props,      videoUrl: data.url,    },  };};export const RemotionRoot = () => {  return (    <Composition      id="MyComposition"      component={MyComposition}      durationInFrames={100} // Placeholder, will be overridden      fps={30}      width={1080}      height={1080}      defaultProps={{ videoId: "abc123" }}      calculateMetadata={calculateMetadata}    />  );};
```
```
https://api.example.com/video/${props.videoId}
```
```
props
```
```
durationInFrames
```
```
width
```
```
height
```
```
fps
```
```
Caption
```
```
npx remotion add @remotion/captions # If project uses npmbunx remotion add @remotion/captions # If project uses bunyarn remotion add @remotion/captions # If project uses yarnpnpm exec remotion add @remotion/captions # If project uses pnpm
```
```
npx remotion add @remotion/captions # If project uses npmbunx remotion add @remotion/captions # If project uses bunyarn remotion add @remotion/captions # If project uses yarnpnpm exec remotion add @remotion/captions # If project uses pnpm
```
```
createTikTokStyleCaptions()
```
```
combineTokensWithinMilliseconds
```
```
import {useMemo} from 'react';import {createTikTokStyleCaptions} from '@remotion/captions';import type {Caption} from '@remotion/captions';// How often captions should switch (in milliseconds)// Higher values = more words per page// Lower values = fewer words (more word-by-word)const SWITCH_CAPTIONS_EVERY_MS = 1200;const {pages} = useMemo(() => {  return createTikTokStyleCaptions({    captions,    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,  });}, [captions]);
```
```
import {useMemo} from 'react';import {createTikTokStyleCaptions} from '@remotion/captions';import type {Caption} from '@remotion/captions';// How often captions should switch (in milliseconds)// Higher values = more words per page// Lower values = fewer words (more word-by-word)const SWITCH_CAPTIONS_EVERY_MS = 1200;const {pages} = useMemo(() => {  return createTikTokStyleCaptions({    captions,    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,  });}, [captions]);
```
```
<Sequence>
```
```
import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';import type {TikTokPage} from '@remotion/captions';const CaptionedContent: React.FC = () => {  const {fps} = useVideoConfig();  return (    <AbsoluteFill>      {pages.map((page, index) => {        const nextPage = pages[index + 1] ?? null;        const startFrame = (page.startMs / 1000) * fps;        const endFrame = Math.min(          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,        );        const durationInFrames = endFrame - startFrame;        if (durationInFrames <= 0) {          return null;        }        return (          <Sequence            key={index}            from={startFrame}            durationInFrames={durationInFrames}          >            <CaptionPage page={page} />          </Sequence>        );      })}    </AbsoluteFill>  );};
```
```
import {Sequence, useVideoConfig, AbsoluteFill} from 'remotion';import type {TikTokPage} from '@remotion/captions';const CaptionedContent: React.FC = () => {  const {fps} = useVideoConfig();  return (    <AbsoluteFill>      {pages.map((page, index) => {        const nextPage = pages[index + 1] ?? null;        const startFrame = (page.startMs / 1000) * fps;        const endFrame = Math.min(          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,        );        const durationInFrames = endFrame - startFrame;        if (durationInFrames <= 0) {          return null;        }        return (          <Sequence            key={index}            from={startFrame}            durationInFrames={durationInFrames}          >            <CaptionPage page={page} />          </Sequence>        );      })}    </AbsoluteFill>  );};
```
```
tokens
```
```
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';import type {TikTokPage} from '@remotion/captions';const HIGHLIGHT_COLOR = '#39E508';const CaptionPage: React.FC<{page: TikTokPage}> = ({page}) => {  const frame = useCurrentFrame();  const {fps} = useVideoConfig();  // Current time relative to the start of the sequence  const currentTimeMs = (frame / fps) * 1000;  // Convert to absolute time by adding the page start  const absoluteTimeMs = page.startMs + currentTimeMs;  return (    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>      <div style={{fontSize: 80, fontWeight: 'bold', whiteSpace: 'pre'}}>        {page.tokens.map((token) => {          const isActive =            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;          return (            <span              key={token.fromMs}              style={{color: isActive ? HIGHLIGHT_COLOR : 'white'}}            >              {token.text}            </span>          );        })}      </div>    </AbsoluteFill>  );};
```
```
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';import type {TikTokPage} from '@remotion/captions';const HIGHLIGHT_COLOR = '#39E508';const CaptionPage: React.FC<{page: TikTokPage}> = ({page}) => {  const frame = useCurrentFrame();  const {fps} = useVideoConfig();  // Current time relative to the start of the sequence  const currentTimeMs = (frame / fps) * 1000;  // Convert to absolute time by adding the page start  const absoluteTimeMs = page.startMs + currentTimeMs;  return (    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>      <div style={{fontSize: 80, fontWeight: 'bold', whiteSpace: 'pre'}}>        {page.tokens.map((token) => {          const isActive =            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;          return (            <span              key={token.fromMs}              style={{color: isActive ? HIGHLIGHT_COLOR : 'white'}}            >              {token.text}            </span>          );        })}      </div>    </AbsoluteFill>  );};
```
```
extractFrames()
```
```
import {  ALL_FORMATS,  Input,  UrlSource,  VideoSample,  VideoSampleSink,} from "mediabunny";type Options = {  track: { width: number; height: number };  container: string;  durationInSeconds: number | null;};export type ExtractFramesTimestampsInSecondsFn = (  options: Options) => Promise<number[]> | number[];export type ExtractFramesProps = {  src: string;  timestampsInSeconds: number[] | ExtractFramesTimestampsInSecondsFn;  onVideoSample: (sample: VideoSample) => void;  signal?: AbortSignal;};export async function extractFrames({  src,  timestampsInSeconds,  onVideoSample,  signal,}: ExtractFramesProps): Promise<void> {  using input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src),  });  const [durationInSeconds, format, videoTrack] = await Promise.all([    input.computeDuration(),    input.getFormat(),    input.getPrimaryVideoTrack(),  ]);  if (!videoTrack) {    throw new Error("No video track found in the input");  }  if (signal?.aborted) {    throw new Error("Aborted");  }  const timestamps =    typeof timestampsInSeconds === "function"      ? await timestampsInSeconds({          track: {            width: videoTrack.displayWidth,            height: videoTrack.displayHeight,          },          container: format.name,          durationInSeconds,        })      : timestampsInSeconds;  if (timestamps.length === 0) {    return;  }  if (signal?.aborted) {    throw new Error("Aborted");  }  const sink = new VideoSampleSink(videoTrack);  for await (using videoSample of sink.samplesAtTimestamps(timestamps)) {    if (signal?.aborted) {      break;    }    if (!videoSample) {      continue;    }    onVideoSample(videoSample);  }}
```
```
import {  ALL_FORMATS,  Input,  UrlSource,  VideoSample,  VideoSampleSink,} from "mediabunny";type Options = {  track: { width: number; height: number };  container: string;  durationInSeconds: number | null;};export type ExtractFramesTimestampsInSecondsFn = (  options: Options) => Promise<number[]> | number[];export type ExtractFramesProps = {  src: string;  timestampsInSeconds: number[] | ExtractFramesTimestampsInSecondsFn;  onVideoSample: (sample: VideoSample) => void;  signal?: AbortSignal;};export async function extractFrames({  src,  timestampsInSeconds,  onVideoSample,  signal,}: ExtractFramesProps): Promise<void> {  using input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src),  });  const [durationInSeconds, format, videoTrack] = await Promise.all([    input.computeDuration(),    input.getFormat(),    input.getPrimaryVideoTrack(),  ]);  if (!videoTrack) {    throw new Error("No video track found in the input");  }  if (signal?.aborted) {    throw new Error("Aborted");  }  const timestamps =    typeof timestampsInSeconds === "function"      ? await timestampsInSeconds({          track: {            width: videoTrack.displayWidth,            height: videoTrack.displayHeight,          },          container: format.name,          durationInSeconds,        })      : timestampsInSeconds;  if (timestamps.length === 0) {    return;  }  if (signal?.aborted) {    throw new Error("Aborted");  }  const sink = new VideoSampleSink(videoTrack);  for await (using videoSample of sink.samplesAtTimestamps(timestamps)) {    if (signal?.aborted) {      break;    }    if (!videoSample) {      continue;    }    onVideoSample(videoSample);  }}
```
```
await extractFrames({  src: "https://remotion.media/video.mp4",  timestampsInSeconds: [0, 1, 2, 3, 4],  onVideoSample: (sample) => {    const canvas = document.createElement("canvas");    canvas.width = sample.displayWidth;    canvas.height = sample.displayHeight;    const ctx = canvas.getContext("2d");    sample.draw(ctx!, 0, 0);  },});
```
```
await extractFrames({  src: "https://remotion.media/video.mp4",  timestampsInSeconds: [0, 1, 2, 3, 4],  onVideoSample: (sample) => {    const canvas = document.createElement("canvas");    canvas.width = sample.displayWidth;    canvas.height = sample.displayHeight;    const ctx = canvas.getContext("2d");    sample.draw(ctx!, 0, 0);  },});
```
```
const canvasWidth = 500;const canvasHeight = 80;const fromSeconds = 0;const toSeconds = 10;await extractFrames({  src: "https://remotion.media/video.mp4",  timestampsInSeconds: async ({ track, durationInSeconds }) => {    const aspectRatio = track.width / track.height;    const amountOfFramesFit = Math.ceil(      canvasWidth / (canvasHeight * aspectRatio)    );    const segmentDuration = toSeconds - fromSeconds;    const timestamps: number[] = [];    for (let i = 0; i < amountOfFramesFit; i++) {      timestamps.push(        fromSeconds + (segmentDuration / amountOfFramesFit) * (i + 0.5)      );    }    return timestamps;  },  onVideoSample: (sample) => {    console.log(Frame at ${sample.timestamp}s);    const canvas = document.createElement("canvas");    canvas.width = sample.displayWidth;    canvas.height = sample.displayHeight;    const ctx = canvas.getContext("2d");    sample.draw(ctx!, 0, 0);  },});
```
```
const canvasWidth = 500;const canvasHeight = 80;const fromSeconds = 0;const toSeconds = 10;await extractFrames({  src: "https://remotion.media/video.mp4",  timestampsInSeconds: async ({ track, durationInSeconds }) => {    const aspectRatio = track.width / track.height;    const amountOfFramesFit = Math.ceil(      canvasWidth / (canvasHeight * aspectRatio)    );    const segmentDuration = toSeconds - fromSeconds;    const timestamps: number[] = [];    for (let i = 0; i < amountOfFramesFit; i++) {      timestamps.push(        fromSeconds + (segmentDuration / amountOfFramesFit) * (i + 0.5)      );    }    return timestamps;  },  onVideoSample: (sample) => {    console.log(Frame at ${sample.timestamp}s);    const canvas = document.createElement("canvas");    canvas.width = sample.displayWidth;    canvas.height = sample.displayHeight;    const ctx = canvas.getContext("2d");    sample.draw(ctx!, 0, 0);  },});
```
```
Frame at ${sample.timestamp}s
```
```
const controller = new AbortController();setTimeout(() => controller.abort(), 5000);try {  await extractFrames({    src: "https://remotion.media/video.mp4",    timestampsInSeconds: [0, 1, 2, 3, 4],    onVideoSample: (sample) => {      using frame = sample;      const canvas = document.createElement("canvas");      canvas.width = frame.displayWidth;      canvas.height = frame.displayHeight;      const ctx = canvas.getContext("2d");      frame.draw(ctx!, 0, 0);    },    signal: controller.signal,  });  console.log("Frame extraction complete!");} catch (error) {  console.error("Frame extraction was aborted or failed:", error);}
```
```
const controller = new AbortController();setTimeout(() => controller.abort(), 5000);try {  await extractFrames({    src: "https://remotion.media/video.mp4",    timestampsInSeconds: [0, 1, 2, 3, 4],    onVideoSample: (sample) => {      using frame = sample;      const canvas = document.createElement("canvas");      canvas.width = frame.displayWidth;      canvas.height = frame.displayHeight;      const ctx = canvas.getContext("2d");      frame.draw(ctx!, 0, 0);    },    signal: controller.signal,  });  console.log("Frame extraction complete!");} catch (error) {  console.error("Frame extraction was aborted or failed:", error);}
```
```
const controller = new AbortController();const timeoutPromise = new Promise<never>((_, reject) => {  const timeoutId = setTimeout(() => {    controller.abort();    reject(new Error("Frame extraction timed out after 10 seconds"));  }, 10000);  controller.signal.addEventListener("abort", () => clearTimeout(timeoutId), {    once: true,  });});try {  await Promise.race([    extractFrames({      src: "https://remotion.media/video.mp4",      timestampsInSeconds: [0, 1, 2, 3, 4],      onVideoSample: (sample) => {        using frame = sample;        const canvas = document.createElement("canvas");        canvas.width = frame.displayWidth;        canvas.height = frame.displayHeight;        const ctx = canvas.getContext("2d");        frame.draw(ctx!, 0, 0);      },      signal: controller.signal,    }),    timeoutPromise,  ]);  console.log("Frame extraction complete!");} catch (error) {  console.error("Frame extraction was aborted or failed:", error);}
```
```
const controller = new AbortController();const timeoutPromise = new Promise<never>((_, reject) => {  const timeoutId = setTimeout(() => {    controller.abort();    reject(new Error("Frame extraction timed out after 10 seconds"));  }, 10000);  controller.signal.addEventListener("abort", () => clearTimeout(timeoutId), {    once: true,  });});try {  await Promise.race([    extractFrames({      src: "https://remotion.media/video.mp4",      timestampsInSeconds: [0, 1, 2, 3, 4],      onVideoSample: (sample) => {        using frame = sample;        const canvas = document.createElement("canvas");        canvas.width = frame.displayWidth;        canvas.height = frame.displayHeight;        const ctx = canvas.getContext("2d");        frame.draw(ctx!, 0, 0);      },      signal: controller.signal,    }),    timeoutPromise,  ]);  console.log("Frame extraction complete!");} catch (error) {  console.error("Frame extraction was aborted or failed:", error);}
```
```
npx remotion add @remotion/google-fonts # If project uses npmbunx remotion add @remotion/google-fonts # If project uses bunyarn remotion add @remotion/google-fonts # If project uses yarnpnpm exec remotion add @remotion/google-fonts # If project uses pnpm
```
```
npx remotion add @remotion/google-fonts # If project uses npmbunx remotion add @remotion/google-fonts # If project uses bunyarn remotion add @remotion/google-fonts # If project uses yarnpnpm exec remotion add @remotion/google-fonts # If project uses pnpm
```
```
import { loadFont } from "@remotion/google-fonts/Lobster";const { fontFamily } = loadFont();export const MyComposition = () => {  return <div style={{ fontFamily }}>Hello World</div>;};
```
```
import { loadFont } from "@remotion/google-fonts/Lobster";const { fontFamily } = loadFont();export const MyComposition = () => {  return <div style={{ fontFamily }}>Hello World</div>;};
```
```
import { loadFont } from "@remotion/google-fonts/Roboto";const { fontFamily } = loadFont("normal", {  weights: ["400", "700"],  subsets: ["latin"],});
```
```
import { loadFont } from "@remotion/google-fonts/Roboto";const { fontFamily } = loadFont("normal", {  weights: ["400", "700"],  subsets: ["latin"],});
```
```
waitUntilDone()
```
```
import { loadFont } from "@remotion/google-fonts/Lobster";const { fontFamily, waitUntilDone } = loadFont();await waitUntilDone();
```
```
import { loadFont } from "@remotion/google-fonts/Lobster";const { fontFamily, waitUntilDone } = loadFont();await waitUntilDone();
```
```
@remotion/fonts
```
```
npx remotion add @remotion/fonts # If project uses npmbunx remotion add @remotion/fonts # If project uses bunyarn remotion add @remotion/fonts # If project uses yarnpnpm exec remotion add @remotion/fonts # If project uses pnpm
```
```
npx remotion add @remotion/fonts # If project uses npmbunx remotion add @remotion/fonts # If project uses bunyarn remotion add @remotion/fonts # If project uses yarnpnpm exec remotion add @remotion/fonts # If project uses pnpm
```
```
public/
```
```
loadFont()
```
```
import { loadFont } from "@remotion/fonts";import { staticFile } from "remotion";await loadFont({  family: "MyFont",  url: staticFile("MyFont-Regular.woff2"),});export const MyComposition = () => {  return <div style={{ fontFamily: "MyFont" }}>Hello World</div>;};
```
```
import { loadFont } from "@remotion/fonts";import { staticFile } from "remotion";await loadFont({  family: "MyFont",  url: staticFile("MyFont-Regular.woff2"),});export const MyComposition = () => {  return <div style={{ fontFamily: "MyFont" }}>Hello World</div>;};
```
```
import { loadFont } from "@remotion/fonts";import { staticFile } from "remotion";await Promise.all([  loadFont({    family: "Inter",    url: staticFile("Inter-Regular.woff2"),    weight: "400",  }),  loadFont({    family: "Inter",    url: staticFile("Inter-Bold.woff2"),    weight: "700",  }),]);
```
```
import { loadFont } from "@remotion/fonts";import { staticFile } from "remotion";await Promise.all([  loadFont({    family: "Inter",    url: staticFile("Inter-Regular.woff2"),    weight: "400",  }),  loadFont({    family: "Inter",    url: staticFile("Inter-Bold.woff2"),    weight: "700",  }),]);
```
```
loadFont({  family: "MyFont", // Required: name to use in CSS  url: staticFile("font.woff2"), // Required: font file URL  format: "woff2", // Optional: auto-detected from extension  weight: "400", // Optional: font weight  style: "normal", // Optional: normal or italic  display: "block", // Optional: font-display behavior});
```
```
loadFont({  family: "MyFont", // Required: name to use in CSS  url: staticFile("font.woff2"), // Required: font file URL  format: "woff2", // Optional: auto-detected from extension  weight: "400", // Optional: font weight  style: "normal", // Optional: normal or italic  display: "block", // Optional: font-display behavior});
```
```
loadFont()
```
```
import { loadFont } from "@remotion/google-fonts/Montserrat";const { fontFamily } = loadFont("normal", {  weights: ["400", "700"],  subsets: ["latin"],});export const Title: React.FC<{ text: string }> = ({ text }) => {  return (    <h1      style={{        fontFamily,        fontSize: 80,        fontWeight: "bold",      }}    >      {text}    </h1>  );};
```
```
import { loadFont } from "@remotion/google-fonts/Montserrat";const { fontFamily } = loadFont("normal", {  weights: ["400", "700"],  subsets: ["latin"],});export const Title: React.FC<{ text: string }> = ({ text }) => {  return (    <h1      style={{        fontFamily,        fontSize: 80,        fontWeight: "bold",      }}    >      {text}    </h1>  );};
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const getAudioDuration = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  const durationInSeconds = await input.computeDuration();  return durationInSeconds;};
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const getAudioDuration = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  const durationInSeconds = await input.computeDuration();  return durationInSeconds;};
```
```
const duration = await getAudioDuration("https://remotion.media/audio.mp3");console.log(duration); // e.g. 180.5 (seconds)
```
```
const duration = await getAudioDuration("https://remotion.media/audio.mp3");console.log(duration); // e.g. 180.5 (seconds)
```
```
FileSource
```
```
UrlSource
```
```
import { Input, ALL_FORMATS, FileSource } from "mediabunny";const input = new Input({  formats: ALL_FORMATS,  source: new FileSource(file), // File object from input or drag-drop});const durationInSeconds = await input.computeDuration();
```
```
import { Input, ALL_FORMATS, FileSource } from "mediabunny";const input = new Input({  formats: ALL_FORMATS,  source: new FileSource(file), // File object from input or drag-drop});const durationInSeconds = await input.computeDuration();
```
```
import { staticFile } from "remotion";const duration = await getAudioDuration(staticFile("audio.mp3"));
```
```
import { staticFile } from "remotion";const duration = await getAudioDuration(staticFile("audio.mp3"));
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const getVideoDimensions = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  const videoTrack = await input.getPrimaryVideoTrack();  if (!videoTrack) {    throw new Error("No video track found");  }  return {    width: videoTrack.displayWidth,    height: videoTrack.displayHeight,  };};
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const getVideoDimensions = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  const videoTrack = await input.getPrimaryVideoTrack();  if (!videoTrack) {    throw new Error("No video track found");  }  return {    width: videoTrack.displayWidth,    height: videoTrack.displayHeight,  };};
```
```
const dimensions = await getVideoDimensions("https://remotion.media/video.mp4");console.log(dimensions.width);  // e.g. 1920console.log(dimensions.height); // e.g. 1080
```
```
const dimensions = await getVideoDimensions("https://remotion.media/video.mp4");console.log(dimensions.width);  // e.g. 1920console.log(dimensions.height); // e.g. 1080
```
```
FileSource
```
```
UrlSource
```
```
import { Input, ALL_FORMATS, FileSource } from "mediabunny";const input = new Input({  formats: ALL_FORMATS,  source: new FileSource(file), // File object from input or drag-drop});const videoTrack = await input.getPrimaryVideoTrack();const width = videoTrack.displayWidth;const height = videoTrack.displayHeight;
```
```
import { Input, ALL_FORMATS, FileSource } from "mediabunny";const input = new Input({  formats: ALL_FORMATS,  source: new FileSource(file), // File object from input or drag-drop});const videoTrack = await input.getPrimaryVideoTrack();const width = videoTrack.displayWidth;const height = videoTrack.displayHeight;
```
```
import { staticFile } from "remotion";const dimensions = await getVideoDimensions(staticFile("video.mp4"));
```
```
import { staticFile } from "remotion";const dimensions = await getVideoDimensions(staticFile("video.mp4"));
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const getVideoDuration = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  const durationInSeconds = await input.computeDuration();  return durationInSeconds;};
```
```
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";export const getVideoDuration = async (src: string) => {  const input = new Input({    formats: ALL_FORMATS,    source: new UrlSource(src, {      getRetryDelay: () => null,    }),  });  const durationInSeconds = await input.computeDuration();  return durationInSeconds;};
```
```
const duration = await getVideoDuration("https://remotion.media/video.mp4");console.log(duration); // e.g. 10.5 (seconds)
```
```
const duration = await getVideoDuration("https://remotion.media/video.mp4");console.log(duration); // e.g. 10.5 (seconds)
```
```
FileSource
```
```
UrlSource
```
```
import { Input, ALL_FORMATS, FileSource } from "mediabunny";const input = new Input({  formats: ALL_FORMATS,  source: new FileSource(file), // File object from input or drag-drop});const durationInSeconds = await input.computeDuration();
```
```
import { Input, ALL_FORMATS, FileSource } from "mediabunny";const input = new Input({  formats: ALL_FORMATS,  source: new FileSource(file), // File object from input or drag-drop});const durationInSeconds = await input.computeDuration();
```
```
import { staticFile } from "remotion";const duration = await getVideoDuration(staticFile("video.mp4"));
```
```
import { staticFile } from "remotion";const duration = await getVideoDuration(staticFile("video.mp4"));
```
```
<AnimatedImage>
```
```
import {AnimatedImage, staticFile} from 'remotion';export const MyComposition = () => {  return <AnimatedImage src={staticFile('animation.gif')} width={500} height={500} />;};
```
```
import {AnimatedImage, staticFile} from 'remotion';export const MyComposition = () => {  return <AnimatedImage src={staticFile('animation.gif')} width={500} height={500} />;};
```
```
<AnimatedImage src="https://example.com/animation.gif" width={500} height={500} />
```
```
<AnimatedImage src="https://example.com/animation.gif" width={500} height={500} />
```
```
fit
```
```
// Stretch to fill (default)<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="fill" />// Maintain aspect ratio, fit inside container<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="contain" />// Fill container, crop if needed<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="cover" />
```
```
// Stretch to fill (default)<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="fill" />// Maintain aspect ratio, fit inside container<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="contain" />// Fill container, crop if needed<AnimatedImage src={staticFile("animation.gif")} width={500} height={300} fit="cover" />
```
```
playbackRate
```
```
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} playbackRate={2} /> {/* 2x speed */}<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} playbackRate={0.5} /> {/* Half speed */}
```
```
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} playbackRate={2} /> {/* 2x speed */}<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} playbackRate={0.5} /> {/* Half speed */}
```
```
// Loop indefinitely (default)<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="loop" />// Play once, show final frame<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="pause-after-finish" />// Play once, then clear canvas<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="clear-after-finish" />
```
```
// Loop indefinitely (default)<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="loop" />// Play once, show final frame<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="pause-after-finish" />// Play once, then clear canvas<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} loopBehavior="clear-after-finish" />
```
```
style
```
```
width
```
```
height
```
```
<AnimatedImage  src={staticFile('animation.gif')}  width={500}  height={500}  style={{    borderRadius: 20,    position: 'absolute',    top: 100,    left: 50,  }}/>
```
```
<AnimatedImage  src={staticFile('animation.gif')}  width={500}  height={500}  style={{    borderRadius: 20,    position: 'absolute',    top: 100,    left: 50,  }}/>
```
```
getGifDurationInSeconds()
```
```
@remotion/gif
```
```
npx remotion add @remotion/gif # If project uses npmbunx remotion add @remotion/gif # If project uses bunyarn remotion add @remotion/gif # If project uses yarnpnpm exec remotion add @remotion/gif # If project uses pnpm
```
```
npx remotion add @remotion/gif # If project uses npmbunx remotion add @remotion/gif # If project uses bunyarn remotion add @remotion/gif # If project uses yarnpnpm exec remotion add @remotion/gif # If project uses pnpm
```
```
import {getGifDurationInSeconds} from '@remotion/gif';import {staticFile} from 'remotion';const duration = await getGifDurationInSeconds(staticFile('animation.gif'));console.log(duration); // e.g. 2.5
```
```
import {getGifDurationInSeconds} from '@remotion/gif';import {staticFile} from 'remotion';const duration = await getGifDurationInSeconds(staticFile('animation.gif'));console.log(duration); // e.g. 2.5
```
```
import {getGifDurationInSeconds} from '@remotion/gif';import {staticFile, CalculateMetadataFunction} from 'remotion';const calculateMetadata: CalculateMetadataFunction = async () => {  const duration = await getGifDurationInSeconds(staticFile('animation.gif'));  return {    durationInFrames: Math.ceil(duration * 30),  };};
```
```
import {getGifDurationInSeconds} from '@remotion/gif';import {staticFile, CalculateMetadataFunction} from 'remotion';const calculateMetadata: CalculateMetadataFunction = async () => {  const duration = await getGifDurationInSeconds(staticFile('animation.gif'));  return {    durationInFrames: Math.ceil(duration * 30),  };};
```
```
<AnimatedImage>
```
```
<Gif>
```
```
@remotion/gif
```
```
npx remotion add @remotion/gif # If project uses npmbunx remotion add @remotion/gif # If project uses bunyarn remotion add @remotion/gif # If project uses yarnpnpm exec remotion add @remotion/gif # If project uses pnpm
```
```
npx remotion add @remotion/gif # If project uses npmbunx remotion add @remotion/gif # If project uses bunyarn remotion add @remotion/gif # If project uses yarnpnpm exec remotion add @remotion/gif # If project uses pnpm
```
```
import {Gif} from '@remotion/gif';import {staticFile} from 'remotion';export const MyComposition = () => {  return <Gif src={staticFile('animation.gif')} width={500} height={500} />;};
```
```
import {Gif} from '@remotion/gif';import {staticFile} from 'remotion';export const MyComposition = () => {  return <Gif src={staticFile('animation.gif')} width={500} height={500} />;};
```
```
<Gif>
```
```
<AnimatedImage>
```
```
<Img>
```
```
<Img>
```
```
remotion
```
```
import { Img, staticFile } from "remotion";export const MyComposition = () => {  return <Img src={staticFile("photo.png")} />;};
```
```
import { Img, staticFile } from "remotion";export const MyComposition = () => {  return <Img src={staticFile("photo.png")} />;};
```
```
<Img>
```
```
remotion
```
```
<img>
```
```
<Image>
```
```
background-image
```
```
<Img>
```
```
public/
```
```
staticFile()
```
```
my-video/├─ public/│  ├─ logo.png│  ├─ avatar.jpg│  └─ icon.svg├─ src/├─ package.json
```
```
my-video/├─ public/│  ├─ logo.png│  ├─ avatar.jpg│  └─ icon.svg├─ src/├─ package.json
```
```
import { Img, staticFile } from "remotion";<Img src={staticFile("logo.png")} />
```
```
import { Img, staticFile } from "remotion";<Img src={staticFile("logo.png")} />
```
```
staticFile()
```
```
<Img src="https://example.com/image.png" />
```
```
<Img src="https://example.com/image.png" />
```
```
<Gif>
```
```
@remotion/gif
```
```
style
```
```
<Img  src={staticFile("photo.png")}  style={{    width: 500,    height: 300,    position: "absolute",    top: 100,    left: 50,    objectFit: "cover",  }}/>
```
```
<Img  src={staticFile("photo.png")}  style={{    width: 500,    height: 300,    position: "absolute",    top: 100,    left: 50,    objectFit: "cover",  }}/>
```
```
import { Img, staticFile, useCurrentFrame } from "remotion";const frame = useCurrentFrame();// Image sequence<Img src={staticFile(frames/frame${frame}.png)} />// Selecting based on props<Img src={staticFile(avatars/${props.userId}.png)} />// Conditional images<Img src={staticFile(icons/${isActive ? "active" : "inactive"}.svg)} />
```
```
import { Img, staticFile, useCurrentFrame } from "remotion";const frame = useCurrentFrame();// Image sequence<Img src={staticFile(frames/frame${frame}.png)} />// Selecting based on props<Img src={staticFile(avatars/${props.userId}.png)} />// Conditional images<Img src={staticFile(icons/${isActive ? "active" : "inactive"}.svg)} />
```
```
frames/frame${frame}.png
```
```
avatars/${props.userId}.png
```
```
icons/${isActive ? "active" : "inactive"}.svg
```
```
getImageDimensions()
```
```
import { getImageDimensions, staticFile } from "remotion";const { width, height } = await getImageDimensions(staticFile("photo.png"));
```
```
import { getImageDimensions, staticFile } from "remotion";const { width, height } = await getImageDimensions(staticFile("photo.png"));
```
```
import { getImageDimensions, staticFile, CalculateMetadataFunction } from "remotion";const calculateMetadata: CalculateMetadataFunction = async () => {  const { width, height } = await getImageDimensions(staticFile("photo.png"));  return {    width,    height,  };};
```
```
import { getImageDimensions, staticFile, CalculateMetadataFunction } from "remotion";const calculateMetadata: CalculateMetadataFunction = async () => {  const { width, height } = await getImageDimensions(staticFile("photo.png"));  return {    width,    height,  };};
```
```
.srt
```
```
parseSrt()
```
```
@remotion/captions
```
```
npx remotion add @remotion/captions # If project uses npmbunx remotion add @remotion/captions # If project uses bunyarn remotion add @remotion/captions # If project uses yarnpnpm exec remotion add @remotion/captions # If project uses pnpm
```
```
npx remotion add @remotion/captions # If project uses npmbunx remotion add @remotion/captions # If project uses bunyarn remotion add @remotion/captions # If project uses yarnpnpm exec remotion add @remotion/captions # If project uses pnpm
```
```
staticFile()
```
```
.srt
```
```
public
```
```
import {useState, useEffect, useCallback} from 'react';import {AbsoluteFill, staticFile, useDelayRender} from 'remotion';import {parseSrt} from '@remotion/captions';import type {Caption} from '@remotion/captions';export const MyComponent: React.FC = () => {  const [captions, setCaptions] = useState<Caption[] | null>(null);  const {delayRender, continueRender, cancelRender} = useDelayRender();  const [handle] = useState(() => delayRender());  const fetchCaptions = useCallback(async () => {    try {      const response = await fetch(staticFile('subtitles.srt'));      const text = await response.text();      const {captions: parsed} = parseSrt({input: text});      setCaptions(parsed);      continueRender(handle);    } catch (e) {      cancelRender(e);    }  }, [continueRender, cancelRender, handle]);  useEffect(() => {    fetchCaptions();  }, [fetchCaptions]);  if (!captions) {    return null;  }  return <AbsoluteFill>{/* Use captions here */}</AbsoluteFill>;};
```
```
import {useState, useEffect, useCallback} from 'react';import {AbsoluteFill, staticFile, useDelayRender} from 'remotion';import {parseSrt} from '@remotion/captions';import type {Caption} from '@remotion/captions';export const MyComponent: React.FC = () => {  const [captions, setCaptions] = useState<Caption[] | null>(null);  const {delayRender, continueRender, cancelRender} = useDelayRender();  const [handle] = useState(() => delayRender());  const fetchCaptions = useCallback(async () => {    try {      const response = await fetch(staticFile('subtitles.srt'));      const text = await response.text();      const {captions: parsed} = parseSrt({input: text});      setCaptions(parsed);      continueRender(handle);    } catch (e) {      cancelRender(e);    }  }, [continueRender, cancelRender, handle]);  useEffect(() => {    fetchCaptions();  }, [fetchCaptions]);  if (!captions) {    return null;  }  return <AbsoluteFill>{/* Use captions here */}</AbsoluteFill>;};
```
```
fetch()
```
```
staticFile()
```
```
Caption
```
```
@remotion/captions
```
```
npx remotion add @remotion/lottie # If project uses npmbunx remotion add @remotion/lottie # If project uses bunyarn remotion add @remotion/lottie # If project uses yarnpnpm exec remotion add @remotion/lottie # If project uses pnpm
```
```
npx remotion add @remotion/lottie # If project uses npmbunx remotion add @remotion/lottie # If project uses bunyarn remotion add @remotion/lottie # If project uses yarnpnpm exec remotion add @remotion/lottie # If project uses pnpm
```
```
delayRender()
```
```
continueRender()
```
```
Lottie
```
```
@remotion/lottie
```
```
import {Lottie, LottieAnimationData} from '@remotion/lottie';import {useEffect, useState} from 'react';import {cancelRender, continueRender, delayRender} from 'remotion';export const MyAnimation = () => {  const [handle] = useState(() => delayRender('Loading Lottie animation'));  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);  useEffect(() => {    fetch('https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json')      .then((data) => data.json())      .then((json) => {        setAnimationData(json);        continueRender(handle);      })      .catch((err) => {        cancelRender(err);      });  }, [handle]);  if (!animationData) {    return null;  }  return <Lottie animationData={animationData} />;};
```
```
import {Lottie, LottieAnimationData} from '@remotion/lottie';import {useEffect, useState} from 'react';import {cancelRender, continueRender, delayRender} from 'remotion';export const MyAnimation = () => {  const [handle] = useState(() => delayRender('Loading Lottie animation'));  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);  useEffect(() => {    fetch('https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json')      .then((data) => data.json())      .then((json) => {        setAnimationData(json);        continueRender(handle);      })      .catch((err) => {        cancelRender(err);      });  }, [handle]);  if (!animationData) {    return null;  }  return <Lottie animationData={animationData} />;};
```
```
style
```
```
return <Lottie animationData={animationData} style={{width: 400, height: 400}} />;
```
```
return <Lottie animationData={animationData} style={{width: 400, height: 400}} />;
```
```
scale()
```
```
getBoundingClientRect()
```
```
useCurrentScale()
```
```
import { useCurrentScale } from "remotion";import { useRef, useEffect, useState } from "react";export const MyComponent = () => {  const ref = useRef<HTMLDivElement>(null);  const scale = useCurrentScale();  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });  useEffect(() => {    if (!ref.current) return;    const rect = ref.current.getBoundingClientRect();    setDimensions({      width: rect.width / scale,      height: rect.height / scale,    });  }, [scale]);  return <div ref={ref}>Content to measure</div>;};
```
```
import { useCurrentScale } from "remotion";import { useRef, useEffect, useState } from "react";export const MyComponent = () => {  const ref = useRef<HTMLDivElement>(null);  const scale = useCurrentScale();  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });  useEffect(() => {    if (!ref.current) return;    const rect = ref.current.getBoundingClientRect();    setDimensions({      width: rect.width / scale,      height: rect.height / scale,    });  }, [scale]);  return <div ref={ref}>Content to measure</div>;};
```
```
npx remotion add @remotion/layout-utils # If project uses npmbunx remotion add @remotion/layout-utils # If project uses bunyarn remotion add @remotion/layout-utils # If project uses yarnpnpm exec remotion add @remotion/layout-utils # If project uses pnpm
```
```
npx remotion add @remotion/layout-utils # If project uses npmbunx remotion add @remotion/layout-utils # If project uses bunyarn remotion add @remotion/layout-utils # If project uses yarnpnpm exec remotion add @remotion/layout-utils # If project uses pnpm
```
```
measureText()
```
```
import { measureText } from "@remotion/layout-utils";const { width, height } = measureText({  text: "Hello World",  fontFamily: "Arial",  fontSize: 32,  fontWeight: "bold",});
```
```
import { measureText } from "@remotion/layout-utils";const { width, height } = measureText({  text: "Hello World",  fontFamily: "Arial",  fontSize: 32,  fontWeight: "bold",});
```
```
fitText()
```
```
import { fitText } from "@remotion/layout-utils";const { fontSize } = fitText({  text: "Hello World",  withinWidth: 600,  fontFamily: "Inter",  fontWeight: "bold",});return (  <div    style={{      fontSize: Math.min(fontSize, 80), // Cap at 80px      fontFamily: "Inter",      fontWeight: "bold",    }}  >    Hello World  </div>);
```
```
import { fitText } from "@remotion/layout-utils";const { fontSize } = fitText({  text: "Hello World",  withinWidth: 600,  fontFamily: "Inter",  fontWeight: "bold",});return (  <div    style={{      fontSize: Math.min(fontSize, 80), // Cap at 80px      fontFamily: "Inter",      fontWeight: "bold",    }}  >    Hello World  </div>);
```
```
fillTextBox()
```
```
import { fillTextBox } from "@remotion/layout-utils";const box = fillTextBox({ maxBoxWidth: 400, maxLines: 3 });const words = ["Hello", "World", "This", "is", "a", "test"];for (const word of words) {  const { exceedsBox } = box.add({    text: word + " ",    fontFamily: "Arial",    fontSize: 24,  });  if (exceedsBox) {    // Text would overflow, handle accordingly    break;  }}
```
```
import { fillTextBox } from "@remotion/layout-utils";const box = fillTextBox({ maxBoxWidth: 400, maxLines: 3 });const words = ["Hello", "World", "This", "is", "a", "test"];for (const word of words) {  const { exceedsBox } = box.add({    text: word + " ",    fontFamily: "Arial",    fontSize: 24,  });  if (exceedsBox) {    // Text would overflow, handle accordingly    break;  }}
```
```
import { loadFont } from "@remotion/google-fonts/Inter";const { fontFamily, waitUntilDone } = loadFont("normal", {  weights: ["400"],  subsets: ["latin"],});waitUntilDone().then(() => {  // Now safe to measure  const { width } = measureText({    text: "Hello",    fontFamily,    fontSize: 32,  });})
```
```
import { loadFont } from "@remotion/google-fonts/Inter";const { fontFamily, waitUntilDone } = loadFont("normal", {  weights: ["400"],  subsets: ["latin"],});waitUntilDone().then(() => {  // Now safe to measure  const { width } = measureText({    text: "Hello",    fontFamily,    fontSize: 32,  });})
```
```
measureText({  text: "Hello",  fontFamily: "MyCustomFont",  fontSize: 32,  validateFontIsLoaded: true, // Throws if font not loaded});
```
```
measureText({  text: "Hello",  fontFamily: "MyCustomFont",  fontSize: 32,  validateFontIsLoaded: true, // Throws if font not loaded});
```
```
const fontStyle = {  fontFamily: "Inter",  fontSize: 32,  fontWeight: "bold" as const,  letterSpacing: "0.5px",};const { width } = measureText({  text: "Hello",  ...fontStyle,});return <div style={fontStyle}>Hello</div>;
```
```
const fontStyle = {  fontFamily: "Inter",  fontSize: 32,  fontWeight: "bold" as const,  letterSpacing: "0.5px",};const { width } = measureText({  text: "Hello",  ...fontStyle,});return <div style={fontStyle}>Hello</div>;
```
```
outline
```
```
border
```
```
<div style={{ outline: "2px solid red" }}>Text</div>
```
```
<div style={{ outline: "2px solid red" }}>Text</div>
```
```
<Sequence>
```
```
import { Sequence } from "remotion";const {fps} = useVideoConfig();<Sequence from={1 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>  <Title /></Sequence><Sequence from={2 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>  <Subtitle /></Sequence>
```
```
import { Sequence } from "remotion";const {fps} = useVideoConfig();<Sequence from={1 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>  <Title /></Sequence><Sequence from={2 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>  <Subtitle /></Sequence>
```
```
layout
```
```
<Sequence layout="none">  <Title /></Sequence>
```
```
<Sequence layout="none">  <Title /></Sequence>
```
```
<Sequence>
```
```
<Sequence premountFor={1 * fps}>  <Title /></Sequence>
```
```
<Sequence premountFor={1 * fps}>  <Title /></Sequence>
```
```
<Series>
```
```
import {Series} from 'remotion';<Series>  <Series.Sequence durationInFrames={45}>    <Intro />  </Series.Sequence>  <Series.Sequence durationInFrames={60}>    <MainContent />  </Series.Sequence>  <Series.Sequence durationInFrames={30}>    <Outro />  </Series.Sequence></Series>;
```
```
import {Series} from 'remotion';<Series>  <Series.Sequence durationInFrames={45}>    <Intro />  </Series.Sequence>  <Series.Sequence durationInFrames={60}>    <MainContent />  </Series.Sequence>  <Series.Sequence durationInFrames={30}>    <Outro />  </Series.Sequence></Series>;
```
```
<Sequence>
```
```
<Series.Sequence>
```
```
layout
```
```
none
```
```
<Series>  <Series.Sequence durationInFrames={60}>    <SceneA />  </Series.Sequence>  <Series.Sequence offset={-15} durationInFrames={60}>    {/* Starts 15 frames before SceneA ends */}    <SceneB />  </Series.Sequence></Series>
```
```
<Series>  <Series.Sequence durationInFrames={60}>    <SceneA />  </Series.Sequence>  <Series.Sequence offset={-15} durationInFrames={60}>    {/* Starts 15 frames before SceneA ends */}    <SceneB />  </Series.Sequence></Series>
```
```
useCurrentFrame()
```
```
<Sequence from={60} durationInFrames={30}>  <MyComponent />  {/* Inside MyComponent, useCurrentFrame() returns 0-29, not 60-89 */}</Sequence>
```
```
<Sequence from={60} durationInFrames={30}>  <MyComponent />  {/* Inside MyComponent, useCurrentFrame() returns 0-29, not 60-89 */}</Sequence>
```
```
<Sequence from={0} durationInFrames={120}>  <Background />  <Sequence from={15} durationInFrames={90} layout="none">    <Title />  </Sequence>  <Sequence from={45} durationInFrames={60} layout="none">    <Subtitle />  </Sequence></Sequence>
```
```
<Sequence from={0} durationInFrames={120}>  <Background />  <Sequence from={15} durationInFrames={90} layout="none">    <Title />  </Sequence>  <Sequence from={45} durationInFrames={60} layout="none">    <Subtitle />  </Sequence></Sequence>
```
```
transition-*
```
```
animate-*
```
```
useCurrentFrame()
```
```
useCurrentFrame()
```
```
interpolate
```
```
ts title="Going from 0 to 1 over 100 frames"import {interpolate} from 'remotion';const opacity = interpolate(frame, [0, 100], [0, 1]);By default, the values are not clamped, so the value can go outside the range [0, 1].  Here is how they can be clamped:ts title="Going from 0 to 1 over 100 frames with extrapolation"const opacity = interpolate(frame, [0, 100], [0, 1], {  extrapolateRight: 'clamp',  extrapolateLeft: 'clamp',});## Spring animationsSpring animations have a more natural motion.  They go from 0 to 1 over time.ts title="Spring animation from 0 to 1 over 100 frames"import {spring, useCurrentFrame, useVideoConfig} from 'remotion';const frame = useCurrentFrame();const {fps} = useVideoConfig();const scale = spring({  frame,  fps,});### Physical propertiesThe default configuration is: mass: 1, damping: 10, stiffness: 100.  This leads to the animation having a bit of bounce before it settles.The config can be overwritten like this:tsconst scale = spring({  frame,  fps,  config: {damping: 200},});The recommended configuration for a natural motion without a bounce is: { damping: 200 }.Here are some common configurations:tsxconst smooth = {damping: 200}; // Smooth, no bounce (subtle reveals)const snappy = {damping: 20, stiffness: 200}; // Snappy, minimal bounce (UI elements)const bouncy = {damping: 8}; // Bouncy entrance (playful animations)const heavy = {damping: 15, stiffness: 80, mass: 2}; // Heavy, slow, small bounce### DelayThe animation starts immediately by default.  Use the delay parameter to delay the animation by a number of frames.tsxconst entrance = spring({  frame: frame - ENTRANCE_DELAY,  fps,  delay: 20,});### DurationA spring() has a natural duration based on the physical properties.  To stretch the animation to a specific duration, use the durationInFrames parameter.tsxconst spring = spring({  frame,  fps,  durationInFrames: 40,});### Combining spring() with interpolate()Map spring output (0-1) to custom ranges:tsxconst springProgress = spring({  frame,  fps,});// Map to rotationconst rotation = interpolate(springProgress, [0, 1], [0, 360]);<div style={{rotate: rotation + 'deg'}} />;### Adding springsSprings return just numbers, so math can be performed:tsxconst frame = useCurrentFrame();const {fps, durationInFrames} = useVideoConfig();const inAnimation = spring({  frame,  fps,});const outAnimation = spring({  frame,  fps,  durationInFrames: 1 * fps,  delay: durationInFrames - 1 * fps,});const scale = inAnimation - outAnimation;## EasingEasing can be added to the interpolate function:tsimport {interpolate, Easing} from 'remotion';const value1 = interpolate(frame, [0, 100], [0, 1], {  easing: Easing.inOut(Easing.quad),  extrapolateLeft: 'clamp',  extrapolateRight: 'clamp',});The default easing is Easing.linear.  There are various other convexities:- Easing.in for starting slow and accelerating- Easing.out for starting fast and slowing down- Easing.inOutand curves (sorted from most linear to most curved):- Easing.quad- Easing.sin- Easing.exp- Easing.circleConvexities and curves need be combined for an easing function:tsconst value1 = interpolate(frame, [0, 100], [0, 1], {  easing: Easing.inOut(Easing.quad),  extrapolateLeft: 'clamp',  extrapolateRight: 'clamp',});Cubic bezier curves are also supported:tsconst value1 = interpolate(frame, [0, 100], [0, 1], {  easing: Easing.bezier(0.8, 0.22, 0.96, 0.65),  extrapolateLeft: 'clamp',  extrapolateRight: 'clamp',});------name: transcribe-captionsdescription: Transcribing audio to generate captions in Remotionmetadata:  tags: captions, transcribe, whisper, audio, speech-to-text---# Transcribing audioRemotion provides several built-in options for transcribing audio to generate captions:- @remotion/install-whisper-cpp - Transcribe locally on a server using Whisper.cpp. Fast and free, but requires server infrastructure.  https://remotion.dev/docs/install-whisper-cpp- @remotion/whisper-web - Transcribe in the browser using WebAssembly. No server needed and free, but slower due to WASM overhead.  https://remotion.dev/docs/whisper-web- @remotion/openai-whisper - Use OpenAI Whisper API for cloud-based transcription. Fast and no server needed, but requires payment.  https://remotion.dev/docs/openai-whisper/openai-whisper-api-to-captions------name: transitionsdescription: Fullscreen scene transitions for Remotion.metadata:  tags: transitions, fade, slide, wipe, scenes---## Fullscreen transitionsUsing <TransitionSeries> to animate between multiple scenes or clips.  This will absolutely position the children.## PrerequisitesFirst, the @remotion/transitions package needs to be installed.  If it is not, use the following command:bashnpx remotion add @remotion/transitions # If project uses npmbunx remotion add @remotion/transitions # If project uses bunyarn remotion add @remotion/transitions # If project uses yarnpnpm exec remotion add @remotion/transitions # If project uses pnpm## Example usagetsximport {TransitionSeries, linearTiming} from '@remotion/transitions';import {fade} from '@remotion/transitions/fade';<TransitionSeries>  <TransitionSeries.Sequence durationInFrames={60}>    <SceneA />  </TransitionSeries.Sequence>  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />  <TransitionSeries.Sequence durationInFrames={60}>    <SceneB />  </TransitionSeries.Sequence></TransitionSeries>;## Available Transition TypesImport transitions from their respective modules:tsximport {fade} from '@remotion/transitions/fade';import {slide} from '@remotion/transitions/slide';import {wipe} from '@remotion/transitions/wipe';import {flip} from '@remotion/transitions/flip';import {clockWipe} from '@remotion/transitions/clock-wipe';## Slide Transition with DirectionSpecify slide direction for enter/exit animations.tsximport {slide} from '@remotion/transitions/slide';<TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 20})} />;Directions: "from-left", "from-right", "from-top", "from-bottom"## Timing Optionstsximport {linearTiming, springTiming} from '@remotion/transitions';// Linear timing - constant speedlinearTiming({durationInFrames: 20});// Spring timing - organic motionspringTiming({config: {damping: 200}, durationInFrames: 25});## Duration calculationTransitions overlap adjacent scenes, so the total composition length is **shorter** than the sum of all sequence durations.For example, with two 60-frame sequences and a 15-frame transition:- Without transitions: 60 + 60 = 120 frames- With transition: 60 + 60 - 15 = 105 framesThe transition duration is subtracted because both scenes play simultaneously during the transition.### Getting the duration of a transitionUse the getDurationInFrames() method on the timing object:tsximport {linearTiming, springTiming} from '@remotion/transitions';const linearDuration = linearTiming({durationInFrames: 20}).getDurationInFrames({fps: 30});// Returns 20const springDuration = springTiming({config: {damping: 200}}).getDurationInFrames({fps: 30});// Returns calculated duration based on spring physicsFor springTiming without an explicit durationInFrames, the duration depends on fps because it calculates when the spring animation settles.### Calculating total composition durationtsximport {linearTiming} from '@remotion/transitions';const scene1Duration = 60;const scene2Duration = 60;const scene3Duration = 60;const timing1 = linearTiming({durationInFrames: 15});const timing2 = linearTiming({durationInFrames: 20});const transition1Duration = timing1.getDurationInFrames({fps: 30});const transition2Duration = timing2.getDurationInFrames({fps: 30});const totalDuration = scene1Duration + scene2Duration + scene3Duration - transition1Duration - transition2Duration;// 60 + 60 + 60 - 15 - 20 = 145 frames------name: trimmingdescription: Trimming patterns for Remotion - cut the beginning or end of animationsmetadata:  tags: sequence, trim, clip, cut, offset---Use <Sequence> with a negative from value to trim the start of an animation.## Trim the BeginningA negative from value shifts time backwards, making the animation start partway through:tsximport { Sequence, useVideoConfig } from "remotion";const fps = useVideoConfig();<Sequence from={-0.5 * fps}>  <MyAnimation /></Sequence>The animation appears 15 frames into its progress - the first 15 frames are trimmed off.Inside <MyAnimation>, useCurrentFrame() starts at 15 instead of 0.## Trim the EndUse durationInFrames to unmount content after a specified duration:tsx<Sequence durationInFrames={1.5 * fps}>  <MyAnimation /></Sequence>The animation plays for 45 frames, then the component unmounts.## Trim and DelayNest sequences to both trim the beginning and delay when it appears:tsx<Sequence from={30}>  <Sequence from={-15}>    <MyAnimation />  </Sequence></Sequence>The inner sequence trims 15 frames from the start, and the outer sequence delays the result by 30 frames.------name: videosdescription: Embedding videos in Remotion - trimming, volume, speed, looping, pitchmetadata:  tags: video, media, trim, volume, speed, loop, pitch---# Using videos in Remotion## PrerequisitesFirst, the @remotion/media package needs to be installed.  If it is not, use the following command:bashnpx remotion add @remotion/media # If project uses npmbunx remotion add @remotion/media # If project uses bunyarn remotion add @remotion/media # If project uses yarnpnpm exec remotion add @remotion/media # If project uses pnpmUse <Video> from @remotion/media to embed videos into your composition.tsximport { Video } from "@remotion/media";import { staticFile } from "remotion";export const MyComposition = () => {  return <Video src={staticFile("video.mp4")} />;};Remote URLs are also supported:tsx<Video src="https://remotion.media/video.mp4" />## TrimmingUse trimBefore and trimAfter to remove portions of the video. Values are in seconds.tsxconst { fps } = useVideoConfig();return (  <Video    src={staticFile("video.mp4")}    trimBefore={2 * fps} // Skip the first 2 seconds    trimAfter={10 * fps} // End at the 10 second mark  />);## DelayingWrap the video in a <Sequence> to delay when it appears:tsximport { Sequence, staticFile } from "remotion";import { Video } from "@remotion/media";const { fps } = useVideoConfig();return (  <Sequence from={1 * fps}>    <Video src={staticFile("video.mp4")} />  </Sequence>);The video will appear after 1 second.## Sizing and PositionUse the style prop to control size and position:tsx<Video  src={staticFile("video.mp4")}  style={{    width: 500,    height: 300,    position: "absolute",    top: 100,    left: 50,    objectFit: "cover",  }}/>## VolumeSet a static volume (0 to 1):tsx<Video src={staticFile("video.mp4")} volume={0.5} />Or use a callback for dynamic volume based on the current frame:tsximport { interpolate } from "remotion";const { fps } = useVideoConfig();return (  <Video    src={staticFile("video.mp4")}    volume={(f) =>      interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })    }  />);Use muted to silence the video entirely:tsx<Video src={staticFile("video.mp4")} muted />## SpeedUse playbackRate to change the playback speed:tsx<Video src={staticFile("video.mp4")} playbackRate={2} /> {/* 2x speed */}<Video src={staticFile("video.mp4")} playbackRate={0.5} /> {/* Half speed */}Reverse playback is not supported.## LoopingUse loop to loop the video indefinitely:tsx<Video src={staticFile("video.mp4")} loop />Use loopVolumeCurveBehavior to control how the frame count behaves when looping:- "repeat": Frame count resets to 0 each loop (for volume callback)- "extend": Frame count continues incrementingtsx<Video  src={staticFile("video.mp4")}  loop  loopVolumeCurveBehavior="extend"  volume={(f) => interpolate(f, [0, 300], [1, 0])} // Fade out over multiple loops/>## PitchUse toneFrequency to adjust the pitch without affecting speed. Values range from 0.01 to 2:tsx<Video  src={staticFile("video.mp4")}  toneFrequency={1.5} // Higher pitch/><Video  src={staticFile("video.mp4")}  toneFrequency={0.8} // Lower pitch/>
```
```
By default, the values are not clamped, so the value can go outside the range [0, 1].  Here is how they can be clamped:
```
```
By default, the values are not clamped, so the value can go outside the range [0, 1].  Here is how they can be clamped:
```
```
## Spring animationsSpring animations have a more natural motion.  They go from 0 to 1 over time.
```
```
## Spring animationsSpring animations have a more natural motion.  They go from 0 to 1 over time.
```
```
### Physical propertiesThe default configuration is: mass: 1, damping: 10, stiffness: 100.  This leads to the animation having a bit of bounce before it settles.The config can be overwritten like this:
```
```
### Physical propertiesThe default configuration is:
```
```
.  This leads to the animation having a bit of bounce before it settles.The config can be overwritten like this:
```
```
The recommended configuration for a natural motion without a bounce is: { damping: 200 }.Here are some common configurations:
```
```
The recommended configuration for a natural motion without a bounce is:
```
```
.Here are some common configurations:
```
```
### DelayThe animation starts immediately by default.  Use the delay parameter to delay the animation by a number of frames.
```
```
### DelayThe animation starts immediately by default.  Use the
```
```
parameter to delay the animation by a number of frames.
```
```
### DurationA spring() has a natural duration based on the physical properties.  To stretch the animation to a specific duration, use the durationInFrames parameter.
```
```
### DurationA
```
```
has a natural duration based on the physical properties.  To stretch the animation to a specific duration, use the
```
```
parameter.
```
```
### Combining spring() with interpolate()Map spring output (0-1) to custom ranges:
```
```
### Combining spring() with interpolate()Map spring output (0-1) to custom ranges:
```
```
### Adding springsSprings return just numbers, so math can be performed:
```
```
### Adding springsSprings return just numbers, so math can be performed:
```
```
## EasingEasing can be added to the interpolate function:
```
```
## EasingEasing can be added to the
```
```
function:
```
```
The default easing is Easing.linear.  There are various other convexities:- Easing.in for starting slow and accelerating- Easing.out for starting fast and slowing down- Easing.inOutand curves (sorted from most linear to most curved):- Easing.quad- Easing.sin- Easing.exp- Easing.circleConvexities and curves need be combined for an easing function:
```
```
The default easing is
```
```
.  There are various other convexities:-
```
```
for starting slow and accelerating-
```
```
for starting fast and slowing down-
```
```
and curves (sorted from most linear to most curved):-
```
```
-
```
```
-
```
```
-
```
```
Convexities and curves need be combined for an easing function:
```
```
Cubic bezier curves are also supported:
```
```
Cubic bezier curves are also supported:
```
```
------name: transcribe-captionsdescription: Transcribing audio to generate captions in Remotionmetadata:  tags: captions, transcribe, whisper, audio, speech-to-text---# Transcribing audioRemotion provides several built-in options for transcribing audio to generate captions:- @remotion/install-whisper-cpp - Transcribe locally on a server using Whisper.cpp. Fast and free, but requires server infrastructure.  https://remotion.dev/docs/install-whisper-cpp- @remotion/whisper-web - Transcribe in the browser using WebAssembly. No server needed and free, but slower due to WASM overhead.  https://remotion.dev/docs/whisper-web- @remotion/openai-whisper - Use OpenAI Whisper API for cloud-based transcription. Fast and no server needed, but requires payment.  https://remotion.dev/docs/openai-whisper/openai-whisper-api-to-captions------name: transitionsdescription: Fullscreen scene transitions for Remotion.metadata:  tags: transitions, fade, slide, wipe, scenes---## Fullscreen transitionsUsing <TransitionSeries> to animate between multiple scenes or clips.  This will absolutely position the children.## PrerequisitesFirst, the @remotion/transitions package needs to be installed.  If it is not, use the following command:
```
```
------name: transcribe-captionsdescription: Transcribing audio to generate captions in Remotionmetadata:  tags: captions, transcribe, whisper, audio, speech-to-text---# Transcribing audioRemotion provides several built-in options for transcribing audio to generate captions:-
```
```
- Transcribe locally on a server using Whisper.cpp. Fast and free, but requires server infrastructure.  https://remotion.dev/docs/install-whisper-cpp-
```
```
- Transcribe in the browser using WebAssembly. No server needed and free, but slower due to WASM overhead.  https://remotion.dev/docs/whisper-web-
```
```
- Use OpenAI Whisper API for cloud-based transcription. Fast and no server needed, but requires payment.  https://remotion.dev/docs/openai-whisper/openai-whisper-api-to-captions------name: transitionsdescription: Fullscreen scene transitions for Remotion.metadata:  tags: transitions, fade, slide, wipe, scenes---## Fullscreen transitionsUsing
```
```
to animate between multiple scenes or clips.  This will absolutely position the children.## PrerequisitesFirst, the @remotion/transitions package needs to be installed.  If it is not, use the following command:
```
```
## Example usage
```
```
## Example usage
```
```
## Available Transition TypesImport transitions from their respective modules:
```
```
## Available Transition TypesImport transitions from their respective modules:
```
```
## Slide Transition with DirectionSpecify slide direction for enter/exit animations.
```
```
## Slide Transition with DirectionSpecify slide direction for enter/exit animations.
```
```
Directions: "from-left", "from-right", "from-top", "from-bottom"## Timing Options
```
```
Directions:
```
```
,
```
```
,
```
```
,
```
```
## Timing Options
```
```
## Duration calculationTransitions overlap adjacent scenes, so the total composition length is **shorter** than the sum of all sequence durations.For example, with two 60-frame sequences and a 15-frame transition:- Without transitions: 60 + 60 = 120 frames- With transition: 60 + 60 - 15 = 105 framesThe transition duration is subtracted because both scenes play simultaneously during the transition.### Getting the duration of a transitionUse the getDurationInFrames() method on the timing object:
```
```
## Duration calculationTransitions overlap adjacent scenes, so the total composition length is **shorter** than the sum of all sequence durations.For example, with two 60-frame sequences and a 15-frame transition:- Without transitions:
```
```
frames- With transition:
```
```
framesThe transition duration is subtracted because both scenes play simultaneously during the transition.### Getting the duration of a transitionUse the
```
```
method on the timing object:
```
```
For springTiming without an explicit durationInFrames, the duration depends on fps because it calculates when the spring animation settles.### Calculating total composition duration
```
```
For
```
```
without an explicit
```
```
, the duration depends on
```
```
because it calculates when the spring animation settles.### Calculating total composition duration
```
```
------name: trimmingdescription: Trimming patterns for Remotion - cut the beginning or end of animationsmetadata:  tags: sequence, trim, clip, cut, offset---Use <Sequence> with a negative from value to trim the start of an animation.## Trim the BeginningA negative from value shifts time backwards, making the animation start partway through:
```
```
------name: trimmingdescription: Trimming patterns for Remotion - cut the beginning or end of animationsmetadata:  tags: sequence, trim, clip, cut, offset---Use
```
```
with a negative
```
```
value to trim the start of an animation.## Trim the BeginningA negative
```
```
value shifts time backwards, making the animation start partway through:
```
```
The animation appears 15 frames into its progress - the first 15 frames are trimmed off.Inside <MyAnimation>, useCurrentFrame() starts at 15 instead of 0.## Trim the EndUse durationInFrames to unmount content after a specified duration:
```
```
The animation appears 15 frames into its progress - the first 15 frames are trimmed off.Inside
```
```
,
```
```
starts at 15 instead of 0.## Trim the EndUse
```
```
to unmount content after a specified duration:
```
```
The animation plays for 45 frames, then the component unmounts.## Trim and DelayNest sequences to both trim the beginning and delay when it appears:
```
```
The animation plays for 45 frames, then the component unmounts.## Trim and DelayNest sequences to both trim the beginning and delay when it appears:
```
```
The inner sequence trims 15 frames from the start, and the outer sequence delays the result by 30 frames.------name: videosdescription: Embedding videos in Remotion - trimming, volume, speed, looping, pitchmetadata:  tags: video, media, trim, volume, speed, loop, pitch---# Using videos in Remotion## PrerequisitesFirst, the @remotion/media package needs to be installed.  If it is not, use the following command:
```
```
The inner sequence trims 15 frames from the start, and the outer sequence delays the result by 30 frames.------name: videosdescription: Embedding videos in Remotion - trimming, volume, speed, looping, pitchmetadata:  tags: video, media, trim, volume, speed, loop, pitch---# Using videos in Remotion## PrerequisitesFirst, the @remotion/media package needs to be installed.  If it is not, use the following command:
```
```
Use <Video> from @remotion/media to embed videos into your composition.
```
```
Use
```
```
from
```
```
to embed videos into your composition.
```
```
Remote URLs are also supported:
```
```
Remote URLs are also supported:
```
```
## TrimmingUse trimBefore and trimAfter to remove portions of the video. Values are in seconds.
```
```
## TrimmingUse
```
```
and
```
```
to remove portions of the video. Values are in seconds.
```
```
## DelayingWrap the video in a <Sequence> to delay when it appears:
```
```
## DelayingWrap the video in a
```
```
to delay when it appears:
```
```
The video will appear after 1 second.## Sizing and PositionUse the style prop to control size and position:
```
```
The video will appear after 1 second.## Sizing and PositionUse the
```
```
prop to control size and position:
```
```
## VolumeSet a static volume (0 to 1):
```
```
## VolumeSet a static volume (0 to 1):
```
```
Or use a callback for dynamic volume based on the current frame:
```
```
Or use a callback for dynamic volume based on the current frame:
```
```
Use muted to silence the video entirely:
```
```
Use
```
```
to silence the video entirely:
```
```
## SpeedUse playbackRate to change the playback speed:
```
```
## SpeedUse
```
```
to change the playback speed:
```
```
Reverse playback is not supported.## LoopingUse loop to loop the video indefinitely:
```
```
Reverse playback is not supported.## LoopingUse
```
```
to loop the video indefinitely:
```
```
Use loopVolumeCurveBehavior to control how the frame count behaves when looping:- "repeat": Frame count resets to 0 each loop (for volume callback)- "extend": Frame count continues incrementing
```
```
Use
```
```
to control how the frame count behaves when looping:-
```
```
: Frame count resets to 0 each loop (for
```
```
callback)-
```
```
: Frame count continues incrementing
```
```
## PitchUse toneFrequency to adjust the pitch without affecting speed. Values range from 0.01 to 2:
```
```
## PitchUse
```
```
to adjust the pitch without affecting speed. Values range from 0.01 to 2:
```
```
Pitch shifting only works during server-side rendering, not in the Remotion Studio preview or in the
```
Remotion empowers developers to craft stunning videos programmatically using React. This comprehensive agent skill serves as your definitive guide to leveraging Remotion's full potential, ensuring your video projects are not only visually compelling but also optimized for performance and maintainability. Dive into a rich collection of best practices covering everything from advanced animations and 3D rendering to efficient asset management and dynamic composition strategies. Elevate your video generation workflows and build professional-grade content with confidence.

# When to Use This Skill
- •Generating data-driven video reports or infographics with dynamic charts.
- •Creating automated marketing videos, social media clips, or personalized video greetings.
- •Developing complex animated explainers or interactive video experiences in React.
- •Optimizing existing Remotion projects for performance, asset loading, and render times.

# Pro Tips
- 💡Always pre-render compositions with `ffmpeg` or `Remotion CLI` for final output rather than relying solely on browser playback for critical projects.
- 💡Leverage `calculate-metadata` to dynamically adjust video properties based on data, ensuring flexible and scalable video generation.
- 💡When working with complex animations, utilize `useCurrentFrame` and `spring` or `interpolate` from `@remotion/transitions` for smooth, performant movements.


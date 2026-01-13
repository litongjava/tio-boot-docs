# -*- coding: utf-8 -*-
import os
import numpy as np
import requests
from contextlib import contextmanager
from manim import *
import hashlib

from moviepy import AudioFileClip

# 自定义颜色
MY_DARK_BLUE = "#1E3A8A"  # 深蓝色
MY_LIGHT_GRAY = "#F3F4F6"  # 浅灰色
MY_MEDIUM_GRAY = "#D1D5DB"  # 中灰色
MY_GOLD = "#F59E0B"  # 金色
MY_ORANGE = "#F97316"  # 橙色
MY_RED = "#DC2626"  # 红色
MY_WHITE = "#FFFFFF"  # 白色
MY_BLACK = "#000000"  # 黑色

# --- TTS Caching Setup ---
CACHE_DIR = "07/audio"
os.makedirs(CACHE_DIR, exist_ok=True)


class CustomVoiceoverTracker:
    """Tracks audio path and duration for TTS."""

    def __init__(self, audio_path, duration):
        self.audio_path = audio_path
        self.duration = duration


def get_cache_filename(text):
    """Generates a unique filename based on the text hash."""
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    return os.path.join(CACHE_DIR, f"{text_hash}.mp3")


@contextmanager
def custom_voiceover_tts(text, token="123456", base_url="https://javalinux.explanation.fun/api/manim/tts"):
    """
    Fetches TTS audio, caches it, and provides path and duration.
    Usage: with custom_voiceover_tts("text") as tracker: ...
    """
    cache_file = get_cache_filename(text)
    audio_file = cache_file  # Initialize audio_file

    if os.path.exists(cache_file):
        audio_file = cache_file
        print(f"Using cached TTS for: {text[:30]}...")
    else:
        print(f"Requesting TTS for: {text[:30]}...")
        try:
            # URL encode the input text to handle special characters
            input_text_encoded = requests.utils.quote(text)
            url = f"{base_url}?token={token}&input={input_text_encoded}"

            response = requests.get(url, stream=True, timeout=60)  # Added timeout
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

            with open(cache_file, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            audio_file = cache_file
            print("TTS downloaded and cached.")

        except requests.exceptions.RequestException as e:
            print(f"TTS API request failed: {e}")
            # Fallback: create a dummy tracker with zero duration
            tracker = CustomVoiceoverTracker(None, 0)
            yield tracker
            return  # Exit context manager

    # Ensure audio file exists before processing with MoviePy
    if audio_file and os.path.exists(audio_file):
        try:
            clip = AudioFileClip(audio_file)
            duration = clip.duration
            clip.close()
            print(f"Audio duration: {duration:.2f}s")
            tracker = CustomVoiceoverTracker(audio_file, duration)
        except Exception as e:
            print(f"Error processing audio file {audio_file}: {e}")
            # Fallback if audio file is corrupted or invalid
            tracker = CustomVoiceoverTracker(None, 0)
    else:
        # Fallback if audio file was not created or found
        print(f"TTS audio file not found or not created: {audio_file}")
        tracker = CustomVoiceoverTracker(None, 0)

    try:
        yield tracker
    finally:
        # No cleanup needed here as we are caching
        pass


# -----------------------------
# CombinedScene：整合所有场景并添加字幕和音频
# -----------------------------
class CombinedScene(MovingCameraScene):
    """
    合并所有场景的 Manim 动画，用于讲解如何求解函数 f(x)=x^2 的切线方程。
    """
    def construct(self):
        # Use a scene-specific time tracker for updaters if needed outside TTS timing
        self.scene_time_tracker = ValueTracker(0)

        # --- Play Scenes Sequentially ---
        self.play_scene_01()
        self.clear_and_reset()

        self.play_scene_02()
        self.clear_and_reset()

        self.play_scene_03()
        self.clear_and_reset()

        self.play_scene_04()
        self.clear_and_reset()

        self.play_scene_05()
        self.clear_and_reset()

        # End of animation message
        final_message = Text("动画结束，感谢观看！ 😄", font_size=48, color=MY_WHITE)
        bg_final = Rectangle(width=config.frame_width, height=config.frame_height, fill_color=MY_BLACK, fill_opacity=1,
                             stroke_width=0).set_z_index(-10)
        self.add(bg_final)
        self.play(FadeIn(final_message))
        self.wait(2)

    def get_scene_number(self, number_str):
        """创建并定位场景编号"""
        scene_num = Text(number_str, font_size=24, color=MY_WHITE)
        # Ensure the scene number is always within bounds
        scene_num.to_corner(UR, buff=0.3)  # Use smaller buff if needed
        scene_num.set_z_index(10)  # Ensure it's above background
        return scene_num

    def clear_and_reset(self):
        """清除当前场景所有对象并重置相机"""
        # Clear updaters explicitly from all mobjects
        for mob in self.mobjects:
            if mob is not None:
                mob.clear_updaters()

        # Use Group for potentially mixed object types
        valid_mobjects = [m for m in self.mobjects if m is not None]
        all_mobjects = Group(*valid_mobjects)

        if all_mobjects:
            # Fade out existing objects
            self.play(FadeOut(all_mobjects, shift=DOWN * 0.5), run_time=0.5)

        # Clear the scene's mobject list
        self.clear()

        # Reset camera position and scale
        self.camera.frame.move_to(ORIGIN)
        # Ensure frame dimensions match configuration
        self.camera.frame.set(width=config.frame_width, height=config.frame_height)
        # Reset camera orientation (important if rotations were applied)
        # For MovingCameraScene, resetting scale and position is usually enough.
        # If explicit rotation was done: self.camera.frame.set(rotation=0) - check API if needed

        # Reset the custom time tracker
        self.scene_time_tracker.set_value(0)
        self.wait(0.1)  # Short pause after reset

    def star_updater(self, star, dt):
        """更新星星透明度，实现闪烁效果 (Uses scene_time_tracker)"""
        # Retrieve stored parameters or use defaults
        base_opacity = getattr(star, "base_opacity", 0.5)
        frequency = getattr(star, "frequency", 0.5)
        phase = getattr(star, "phase", 0)

        current_time = self.scene_time_tracker.get_value()
        # Calculate opacity based on sine wave
        opacity_variation = 0.4 * np.sin(2 * PI * frequency * current_time + phase)
        target_opacity = np.clip(base_opacity + opacity_variation, 0.1, 0.9)  # Clamp opacity

        # Apply the calculated opacity
        # Use set_opacity which handles both fill and stroke
        star.set_opacity(target_opacity)

        # Manually update the scene time tracker
        self.scene_time_tracker.increment_value(dt)

    # --- Scene 1: Welcome & Starry Background ---
    def play_scene_01(self):
        """场景一：欢迎介绍与星空背景"""
        self.scene_time_tracker.set_value(0)  # Reset time for this scene

        # Background
        bg1 = Rectangle(
            width=config.frame_width,
            height=config.frame_height,
            fill_color=MY_DARK_BLUE,
            fill_opacity=1.0,
            stroke_width=0
        )
        bg1.set_z_index(-10)
        self.add(bg1)

        # Stars
        stars = VGroup()
        num_stars = 200
        for _ in range(num_stars):
            x_pos = np.random.uniform(-config.frame_width / 2 * 0.95, config.frame_width / 2 * 0.95)
            y_pos = np.random.uniform(-config.frame_height / 2 * 0.95, config.frame_height / 2 * 0.95)
            star_dot = Dot(point=[x_pos, y_pos, 0], radius=0.02, color=MY_WHITE)
            # Store custom data directly on the mobject
            star_dot.base_opacity = np.random.uniform(0.3, 0.7)
            star_dot.frequency = np.random.uniform(0.3, 0.8)
            star_dot.phase = np.random.uniform(0, 2 * PI)
            # Set initial opacity using the method, not constructor
            star_dot.set_opacity(star_dot.base_opacity)
            stars.add(star_dot)

        # Add the updater to the stars group
        stars.add_updater(self.star_updater)
        self.add(stars)

        # Scene Number
        scene_num_01 = self.get_scene_number("01")
        self.add(scene_num_01)

        # Title and Subtitle
        title = Text("大家好，欢迎来到本期数学讲解视频 👋", font_size=48, color=MY_WHITE)
        title.move_to(UP * 2.5)  # Position using move_to or shift

        subtitle_part1 = Text("如何求解函数", font_size=36, color=MY_WHITE)
        subtitle_part2 = MathTex("f(x)=x^2", font_size=42, color=MY_ORANGE)
        subtitle_part3 = Text("的切线方程 🤔", font_size=36, color=MY_WHITE)
        subtitle = VGroup(subtitle_part1, subtitle_part2, subtitle_part3).arrange(RIGHT, buff=0.2)
        subtitle.next_to(title, DOWN, buff=0.5)

        # --- TTS Integration ---
        voice_text_01 = "大家好，欢迎来到本期数学讲解视频。👋 本期我们将讲解如何求解函数 f(x) 等于 x 平方的切线方程。🤔"
        with custom_voiceover_tts(voice_text_01) as tracker:
            # Check if audio is available
            if tracker.audio_path and tracker.duration > 0:
                self.add_sound(tracker.audio_path, time_offset=0)
            else:
                print("Warning: Scene 1 TTS audio failed or has zero duration.")
                # If TTS fails, we'll just run the animations without sound sync

            # Subtitle for the voiceover
            subtitle_voice = Text(
                voice_text_01,
                font_size=32,
                color=MY_WHITE,
                # Use width for automatic line breaking
                width=config.frame_width - 2,
                should_center=True  # Center multi-line text
            ).to_edge(DOWN, buff=0.5)

            # Animation sequence synchronized with TTS (if available)
            anim_runtime_title = 1.5
            anim_runtime_subtitle = 2.0
            fade_out_duration = 1.0
            total_anim_duration_planned = anim_runtime_title + anim_runtime_subtitle

            # Animation Group 1: Title + Subtitle Voice Fade In
            self.play(
                AnimationGroup(
                    FadeIn(subtitle_voice, run_time=0.5),  # Quick fade in for subtitle
                    FadeIn(title, shift=UP * 0.5, run_time=anim_runtime_title),
                    lag_ratio=0.0  # Start simultaneously
                ),
                run_time=anim_runtime_title  # Overall duration for this group
            )

            # Animation Group 2: Subtitle parts appear
            self.play(
                AnimationGroup(
                    FadeIn(subtitle_part1, shift=RIGHT * 0.2),
                    Write(subtitle_part2),  # MathTex uses Write
                    FadeIn(subtitle_part3, shift=LEFT * 0.2),
                    lag_ratio=0.2  # Slight delay between parts
                ),
                run_time=anim_runtime_subtitle
            )

            # Calculate wait time based on audio duration vs animation time
            if tracker.duration > 0:
                # Time already spent in animations
                elapsed_time = total_anim_duration_planned
                # Time needed for fade out at the end
                time_for_fadeout = fade_out_duration
                # Calculate remaining time to wait
                remaining_time = tracker.duration - elapsed_time - time_for_fadeout
                if remaining_time > 0:
                    self.wait(remaining_time)
            else:
                # If no audio, just wait a bit after animations
                self.wait(1.0)

            # Fade out the voiceover subtitle
            self.play(FadeOut(subtitle_voice), run_time=fade_out_duration)

        # Keep stars and title/subtitle visible for a moment before clearing
        self.wait(1)

    # --- Scene 2: Tangent Concept & Problem Background ---
    def play_scene_02(self):
        """场景二：切线概念与问题背景介绍"""
        self.scene_time_tracker.set_value(0)  # Reset time

        # Background
        bg2 = Rectangle(
            width=config.frame_width, height=config.frame_height,
            fill_color=MY_LIGHT_GRAY, fill_opacity=1.0, stroke_width=0
        ).set_z_index(-10)
        self.add(bg2)

        # Scene Number
        scene_num_02 = self.get_scene_number("02")
        self.add(scene_num_02)

        # Layout: Left Text, Right Graph
        left_margin = LEFT * (config.frame_width / 4)
        right_margin = RIGHT * (config.frame_width / 4)

        # Left Text explanation
        text_lines = VGroup(
            Text("切线概念：", font_size=36, color=MY_BLACK, weight=BOLD),
            Text("切线是曲线在某一点的瞬时方向。", font_size=30, color=MY_BLACK),
            # Combine Text and MathTex for inline formula
            VGroup(
                Text("对于函数 ", font_size=30, color=MY_BLACK),
                MathTex("f(x)=x^2", font_size=36, color=MY_ORANGE),
                Text("，", font_size=30, color=MY_BLACK),
            ).arrange(RIGHT, buff=0.15),
            Text("切线反映了曲线在该点的斜率变化。", font_size=30, color=MY_BLACK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        text_lines.move_to(left_margin + UP * 1.0)  # Position on the left

        # Right Graph
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[0, 9, 1],
            x_length=6,
            y_length=5,
            # IMPORTANT: Hide central axes to avoid "cross"
            x_axis_config={"stroke_width": 2, "color": MY_BLACK, "include_tip": True},
            y_axis_config={"stroke_width": 2, "color": MY_BLACK, "include_tip": True},
            axis_config={"color": MY_BLACK, "stroke_width": 2},
            tips=False,  # Hide tips if specified in axis_config
        ).move_to(right_margin + DOWN * 0.5)  # Position on the right

        # Hide the zero lines of the axes themselves if they overlay grid lines
        # This is usually done by setting stroke_width to 0 in axis_config,
        # but we want visible axes, just not the implicit lines at x=0, y=0 if they look odd.
        # If using NumberPlane, you'd hide center lines there. For Axes, usually ok.

        # Function and Plot
        func = lambda x: x ** 2
        parabola = axes.plot(func, color=MY_ORANGE, stroke_width=3)
        parabola_label = axes.get_graph_label(parabola, label='f(x)=x^2', x_val=2, direction=UR)
        # Set font size after creation for graph labels
        parabola_label.set_color(MY_ORANGE)
        parabola_label.set_font_size(30)

        # Tangent Point
        a = 1
        tangent_point_coord = axes.c2p(a, func(a))  # Convert graph coords to screen coords
        tangent_point_dot = Dot(tangent_point_coord, color=MY_RED, radius=0.1)
        tangent_point_label = MathTex("(a, a^2)", font_size=30, color=MY_RED)
        tangent_point_label.next_to(tangent_point_dot, DR, buff=0.1)

        # Pulsing animation for the dot (simple scale pulse)
        # We'll use an animation loop instead of an updater here for simplicity
        dot_pulse_anim = Succession(
            ApplyMethod(tangent_point_dot.scale, 1.3, rate_func=there_and_back, run_time=1.0),
            Wait(0.5)
        )

        # --- TTS Integration ---
        voice_text_02 = "首先我们来理解切线的概念。切线就是曲线在某一点的瞬时方向。对于我们研究的函数 f(x) 等于 x 平方，它的图像是一条抛物线。我们关注的是如何找到这条抛物线上任意一点，比如点 (a, a平方) 处的切线。"
        with custom_voiceover_tts(voice_text_02) as tracker:
            if tracker.audio_path and tracker.duration > 0:
                self.add_sound(tracker.audio_path, time_offset=0)
            else:
                print("Warning: Scene 2 TTS audio failed or has zero duration.")

            subtitle_voice_02 = Text(
                voice_text_02, font_size=32, color=MY_BLACK,
                width=config.frame_width - 2, should_center=True
            ).to_edge(DOWN, buff=0.5)

            # Staggered animation appearance
            self.play(
                AnimationGroup(
                    FadeIn(subtitle_voice_02, run_time=0.5),
                    # Create Axes and Parabola first
                    Create(axes, run_time=2.0),
                    Create(parabola, run_time=2.0),
                    lag_ratio=0.0  # Start subtitle and graph creation together
                ),
                run_time=2.0
            )
            # Then fade in text and labels
            self.play(
                AnimationGroup(
                    FadeIn(text_lines, shift=UP * 0.5, lag_ratio=0.1),  # Fade in text lines
                    Write(parabola_label),  # Write graph label
                    lag_ratio=0.3  # Slight lag between text and label
                ),
                run_time=2.5
            )
            # Finally, show the tangent point
            self.play(
                GrowFromCenter(tangent_point_dot),
                Write(tangent_point_label),
                run_time=1.0
            )

            # Play the dot pulse animation while text/graph is shown
            self.play(dot_pulse_anim)  # Run the pulsing animation once

            # Calculate wait time
            elapsed_time = 2.0 + 2.5 + 1.0 + dot_pulse_anim.get_run_time()
            if tracker.duration > 0:
                remaining_time = tracker.duration - elapsed_time - 1.0  # Subtract fade out time
                if remaining_time > 0:
                    self.wait(remaining_time)
            else:
                self.wait(1.0)  # Wait if no audio

            # Fade out subtitle
            self.play(FadeOut(subtitle_voice_02), run_time=1.0)

        self.wait(1)

    # --- Scene 3: Solving Steps ---
    def play_scene_03(self):
        """场景三：切线求解步骤展示"""
        self.scene_time_tracker.set_value(0)

        # Background (Light gray, maybe with faint grid)
        bg3 = Rectangle(
            width=config.frame_width, height=config.frame_height,
            fill_color=MY_LIGHT_GRAY, fill_opacity=1.0, stroke_width=0
        ).set_z_index(-10)
        self.add(bg3)

        # Optional faint grid using NumberPlane
        grid = NumberPlane(
            x_range=[-10, 10, 1], y_range=[-6, 6, 1],
            x_length=config.frame_width, y_length=config.frame_height,
            background_line_style={
                "stroke_color": MY_MEDIUM_GRAY,
                "stroke_width": 1,
                "stroke_opacity": 0.3  # Faint grid lines
            },
            # Hide axis labels and thick center lines of the grid itself
            axis_config={"stroke_width": 0},
            x_axis_config={"stroke_width": 0},
            y_axis_config={"stroke_width": 0},
        ).set_z_index(-9)  # Behind content but above background
        self.add(grid)

        # Scene Number
        scene_num_03 = self.get_scene_number("03")
        self.add(scene_num_03)

        # Layout: Left Steps, Right Graph
        left_margin = LEFT * (config.frame_width / 4)
        right_margin = RIGHT * (config.frame_width / 4)

        # Left: Step-by-step derivation
        steps_title = Text("求解步骤:", font_size=36, color=MY_BLACK, weight=BOLD).to_corner(UL, buff=1.0).shift(
            right_margin * 0.1)  # Adjust position

        # Combine Text (Chinese) and MathTex (Formula) for each step
        step1 = VGroup(Text("1. 确定切点: ", font_size=30, color=MY_BLACK),
                       MathTex("(a, a^2)", font_size=32, color=MY_ORANGE)).arrange(RIGHT, buff=0.15)
        step2 = VGroup(Text("2. 求导数和斜率: ", font_size=30, color=MY_BLACK),
                       MathTex("f'(x)=2x, \\quad f'(a)=2a", font_size=32, color=MY_ORANGE)).arrange(RIGHT, buff=0.15)
        step3 = VGroup(Text("3. 写出点斜式: ", font_size=30, color=MY_BLACK),
                       MathTex("y - a^2 = 2a(x - a)", font_size=32, color=MY_ORANGE)).arrange(RIGHT, buff=0.15)
        step4 = VGroup(Text("4. 整理得切线方程: ", font_size=30, color=MY_BLACK),
                       MathTex("y = 2a(x - a) + a^2", font_size=32, color=MY_ORANGE)).arrange(RIGHT, buff=0.15)

        steps_vg = VGroup(step1, step2, step3, step4).arrange(DOWN, aligned_edge=LEFT, buff=0.4)
        steps_vg.next_to(steps_title, DOWN, aligned_edge=LEFT, buff=0.5)
        steps_vg.move_to(left_margin + UP * 0.5)  # Adjust vertical position

        # Right: Graph Visualization
        axes_step3 = Axes(
            x_range=[-3, 3, 1], y_range=[0, 9, 1],
            x_length=6, y_length=5,
            x_axis_config={"stroke_width": 2, "color": MY_BLACK},
            y_axis_config={"stroke_width": 2, "color": MY_BLACK},
            axis_config={"color": MY_BLACK, "include_tip": False},
            tips=False,
        ).move_to(right_margin + DOWN * 0.5)

        func = lambda x: x ** 2
        parabola_step3 = axes_step3.plot(func, color=MY_ORANGE, stroke_width=3)

        a = 1  # Specific value for visualization
        slope = 2 * a
        tangent_point_coord_step3 = axes_step3.c2p(a, func(a))
        tangent_point_dot_step3 = Dot(tangent_point_coord_step3, color=MY_RED, radius=0.08)  # Slightly smaller dot

        # Tangent Line Calculation (using plot for simplicity)
        tangent_line_func = lambda x: slope * (x - a) + func(a)
        tangent_line = axes_step3.plot(
            tangent_line_func,
            color=MY_GOLD,  # Use Gold for tangent line
            stroke_width=3,
            x_range=[a - 1.5, a + 1.5]  # Limit line length for clarity
        )
        tangent_label = axes_step3.get_graph_label(tangent_line, label='y = 2a(x-a)+a^2', direction=DOWN)
        tangent_label.set_color(MY_GOLD)
        tangent_label.set_font_size(24)  # Smaller font for line label

        # --- TTS Integration ---
        voice_text_03 = "现在我们来一步步求解。第一步，确定切点，就是抛物线上的点 (a, a平方)。第二步，计算函数 f(x) 的导数，得到 f'(x) 等于 2x。那么在点 a 处的斜率就是 f'(a) 等于 2a。第三步，利用点斜式方程，我们可以写出切线的初步形式：y 减 a平方 等于 2a 乘以 (x 减 a)。最后，第四步，整理这个方程，就得到了最终的切线方程：y 等于 2a 乘以 (x 减 a) 再加上 a平方。看右边的图形，当 a=1 时，切点是 (1,1)，斜率是 2，这就是对应的切线。"
        with custom_voiceover_tts(voice_text_03) as tracker:
            if tracker.audio_path and tracker.duration > 0:
                self.add_sound(tracker.audio_path, time_offset=0)
            else:
                print("Warning: Scene 3 TTS audio failed or has zero duration.")

            subtitle_voice_03 = Text(
                voice_text_03, font_size=32, color=MY_BLACK,
                width=config.frame_width - 2, should_center=True
            ).to_edge(DOWN, buff=0.5)

            # Show subtitle and initial elements
            self.play(FadeIn(subtitle_voice_03, run_time=0.5))
            self.play(
                FadeIn(steps_title),
                Create(axes_step3),
                Create(parabola_step3),
                GrowFromCenter(tangent_point_dot_step3),
                run_time=2.0
            )

            # Animate steps appearing one by one, synchronized with rough timing
            self.play(FadeIn(step1[0]), Write(step1[1]), run_time=1.5)  # Step 1
            self.wait(1.0)  # Pause slightly between steps
            self.play(FadeIn(step2[0]), Write(step2[1]), run_time=2.0)  # Step 2
            self.wait(1.0)
            self.play(FadeIn(step3[0]), Write(step3[1]), run_time=2.5)  # Step 3
            # Show tangent line when step 3/4 appears
            self.play(Create(tangent_line), Write(tangent_label), run_time=2.0)
            self.wait(0.5)
            self.play(FadeIn(step4[0]), Write(step4[1]), run_time=2.5)  # Step 4

            # Adjust wait time based on audio duration
            anim_time = 2.0 + 1.5 + 1.0 + 2.0 + 1.0 + 2.5 + 2.0 + 0.5 + 2.5  # Approximate animation time
            if tracker.duration > 0:
                remaining_time = tracker.duration - anim_time - 1.0  # Subtract fade out time
                if remaining_time > 0:
                    self.wait(remaining_time)
            else:
                self.wait(1.0)  # Wait if no audio

            self.play(FadeOut(subtitle_voice_03), run_time=1.0)

        self.wait(1)

    # --- Scene 4: Theoretical Principles ---
    def play_scene_04(self):
        """场景四：理论原理与数学公式解析"""
        self.scene_time_tracker.set_value(0)

        # Background (Medium Gray)
        bg4 = Rectangle(
            width=config.frame_width, height=config.frame_height,
            fill_color=MY_MEDIUM_GRAY, fill_opacity=1.0, stroke_width=0
        ).set_z_index(-10)
        self.add(bg4)

        # Scene Number
        scene_num_04 = self.get_scene_number("04")
        self.add(scene_num_04)

        # Camera intro rotation (optional)
        # self.play(self.camera.frame.animate.rotate(10 * DEGREES, axis=OUT), run_time=1.0)
        # self.play(self.camera.frame.animate.move_to(ORIGIN).rotate(-10 * DEGREES, axis=OUT), run_time=1.0) # Rotate back and center

        # Top: Derivative Definition Formula
        deriv_title = Text("核心原理 1: 导数定义", font_size=32, color=MY_BLACK, weight=BOLD)
        deriv_formula = MathTex(
            r"f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}",
            font_size=48, color=MY_DARK_BLUE
        )
        deriv_group = VGroup(deriv_title, deriv_formula).arrange(DOWN, buff=0.3)
        deriv_group.move_to(UP * 2.0)  # Position top-center

        # Bottom: Point-Slope Form Formula
        point_slope_title = Text("核心原理 2: 点斜式方程", font_size=32, color=MY_BLACK, weight=BOLD)
        point_slope_formula = MathTex(
            r"y - y_1 = m(x - x_1)",
            font_size=48, color=MY_DARK_BLUE
        )
        point_slope_group = VGroup(point_slope_title, point_slope_formula).arrange(DOWN, buff=0.3)
        point_slope_group.move_to(DOWN * 2.0)  # Position bottom-center

        # Arrow connecting the concepts
        # Use Create for arrow animation
        arrow = Arrow(
            deriv_formula.get_bottom() + DOWN * 0.2,  # Start below deriv formula
            point_slope_group.get_top() + UP * 0.2,  # End above point-slope group
            buff=0.1,
            color=MY_GOLD,
            stroke_width=6,
            max_tip_length_to_length_ratio=0.15,  # Adjust arrow tip size
        )

        # --- TTS Integration ---
        voice_text_04 = "回顾一下背后的数学原理。我们计算斜率 2a，是基于导数的定义，它描述了函数在某点变化的快慢。而我们写出最终的切线方程，是利用了直线的点斜式方程，其中 (x1, y1) 就是我们的切点 (a, a平方)，m 就是我们求出的斜率 2a。这两个是求解切线问题的关键理论基础。"
        with custom_voiceover_tts(voice_text_04) as tracker:
            if tracker.audio_path and tracker.duration > 0:
                self.add_sound(tracker.audio_path, time_offset=0)
            else:
                print("Warning: Scene 4 TTS audio failed or has zero duration.")

            subtitle_voice_04 = Text(
                voice_text_04, font_size=32, color=MY_BLACK,
                width=config.frame_width - 2, should_center=True
            ).to_edge(DOWN, buff=0.5)

            self.play(FadeIn(subtitle_voice_04, run_time=0.5))

            # Animate formulas and arrow
            self.play(
                FadeIn(deriv_group, shift=UP * 0.5),
                run_time=2.0
            )
            self.wait(1.0)  # Pause before showing the next part
            self.play(
                FadeIn(point_slope_group, shift=DOWN * 0.5),
                run_time=2.0
            )
            self.wait(0.5)
            # Use Create for the arrow
            self.play(Create(arrow), run_time=1.5)

            # Highlight key parts (optional)
            # self.play(Indicate(deriv_formula.get_part_by_tex("f'(x)")), color=MY_RED)
            # self.play(Indicate(point_slope_formula.get_part_by_tex("m")), color=MY_RED)

            # Calculate wait time
            anim_time = 0.5 + 2.0 + 1.0 + 2.0 + 0.5 + 1.5  # Animation time
            if tracker.duration > 0:
                remaining_time = tracker.duration - anim_time - 1.0  # Subtract fade out time
                if remaining_time > 0:
                    self.wait(remaining_time)
            else:
                self.wait(1.0)  # Wait if no audio

            self.play(FadeOut(subtitle_voice_04), run_time=1.0)

        self.wait(1)

    # --- Scene 5: Summary & Review ---
    def play_scene_05(self):
        """场景五：总结与回顾"""
        self.scene_time_tracker.set_value(0)

        # Background (Dark Blue or Black)
        bg5 = Rectangle(
            width=config.frame_width, height=config.frame_height,
            fill_color=MY_BLACK, fill_opacity=1.0, stroke_width=0
        ).set_z_index(-10)
        self.add(bg5)

        # Scene Number
        scene_num_05 = self.get_scene_number("05")
        self.add(scene_num_05)

        # Summary Title
        summary_title = Text("总结 ✨", font_size=48, color=MY_GOLD, weight=BOLD)
        summary_title.to_edge(UP, buff=1.0)

        # Key formulas
        point_formula = MathTex("(a, a^2)", font_size=40, color=MY_WHITE)
        point_label = Text("切点: ", font_size=36, color=MY_WHITE)
        point_group = VGroup(point_label, point_formula).arrange(RIGHT, buff=0.2)

        deriv_result = MathTex("f'(x)=2x, \\quad f'(a)=2a", font_size=40, color=MY_WHITE)
        deriv_label = Text("导数与斜率: ", font_size=36, color=MY_WHITE)
        deriv_group = VGroup(deriv_label, deriv_result).arrange(RIGHT, buff=0.2)

        tangent_eq = MathTex("y = 2a(x - a) + a^2", font_size=40, color=MY_WHITE)
        tangent_label = Text("切线方程: ", font_size=36, color=MY_WHITE)
        tangent_group = VGroup(tangent_label, tangent_eq).arrange(RIGHT, buff=0.2)

        # Arrange summary items vertically
        summary_formulas = VGroup(point_group, deriv_group, tangent_group).arrange(DOWN, aligned_edge=LEFT, buff=0.6)
        summary_formulas.next_to(summary_title, DOWN, buff=0.8)

        # Question at the bottom
        question = Text("思考 🤔：你认为切线方程还能帮助我们解决哪些类型的问题？", font_size=32, color=MY_LIGHT_GRAY)
        question.to_edge(DOWN, buff=1.0)

        # --- TTS Integration ---
        voice_text_05 = "好了，让我们来总结一下。要求函数 f(x) 等于 x 平方的切线方程，你需要记住三个关键点：一是切点坐标 (a, a平方)，二是导数 f'(x) 等于 2x，由此得到切点斜率 2a，三是最终的切线方程 y 等于 2a 乘以 (x 减 a) 加上 a平方。希望通过本期视频，你已经掌握了这个方法！思考一下，切线方程在数学或其他领域还有哪些应用呢？"
        with custom_voiceover_tts(voice_text_05) as tracker:
            if tracker.audio_path and tracker.duration > 0:
                self.add_sound(tracker.audio_path, time_offset=0)
            else:
                print("Warning: Scene 5 TTS audio failed or has zero duration.")

            subtitle_voice_05 = Text(
                voice_text_05, font_size=32, color=MY_WHITE,
                width=config.frame_width - 2, should_center=True
            ).to_edge(DOWN, buff=0.5)  # Place above the final question maybe?
            # Let's place the fixed question first, then the voice subtitle above it
            subtitle_voice_05.next_to(question, UP, buff=0.3)

            # Animations
            self.play(FadeIn(summary_title), run_time=1.0)
            self.play(FadeIn(subtitle_voice_05, run_time=0.5))  # Show subtitle early

            # Reveal formulas one by one
            self.play(FadeIn(point_group, shift=LEFT * 0.2), run_time=1.5)
            self.wait(0.5)
            self.play(FadeIn(deriv_group, shift=LEFT * 0.2), run_time=1.5)
            self.wait(0.5)
            self.play(FadeIn(tangent_group, shift=LEFT * 0.2), run_time=1.5)
            self.wait(1.0)  # Pause on formulas

            # Show the final question
            self.play(FadeIn(question, shift=UP * 0.2), run_time=1.5)

            # Camera Zoom In
            self.play(self.camera.frame.animate.scale(1.1), run_time=1.5)  # Slight zoom for focus

            # Calculate wait time
            anim_time = 1.0 + 0.5 + 1.5 + 0.5 + 1.5 + 0.5 + 1.5 + 1.0 + 1.5 + 1.5  # Animation time
            if tracker.duration > 0:
                remaining_time = tracker.duration - anim_time - 1.0  # Subtract fade out time
                if remaining_time > 0:
                    self.wait(remaining_time)
            else:
                self.wait(1.0)  # Wait if no audio

            self.play(FadeOut(subtitle_voice_05), run_time=1.0)

        self.wait(2)  # Hold the final summary screen


# --- Main execution block ---
if __name__ == "__main__":
    # Basic configuration
    config.pixel_height = 1080  # Set resolution height
    config.pixel_width = 1920  # Set resolution width
    config.frame_rate = 30  # Set frame rate
    config.output_file = "CombinedScene"  # Specify output filename
    config.disable_caching = True  # Disable caching

    # Set output directory using placeholder for Java replacement
    config.media_dir = r"07"  # IMPORTANT: Use the placeholder

    # Create and render the scene
    scene = CombinedScene()
    scene.render()

    print(f"Scene rendering finished. Output in: {config.media_dir}")
import parselmouth
import os
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import zscore
from flask import url_for
from PIL import Image
import random
import string

def generate_random_string(length=8):
    """랜덤 문자열 생성"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))



def plot_pitch(sound_file1, sound_file2, target_length=10, window_size=25):
    def extract_and_process_pitch(sound_file):
        # 음성 파일에서 pitch 추출
        snd = parselmouth.Sound(sound_file)
        pitch = snd.to_pitch()

        # pitch 값 추출
        pitch_values = pitch.selected_array['frequency']

        # NaN을 제외한 pitch 값만 추출
        valid_indices = np.where(pitch_values != 0)[0]
        pitch_values = pitch_values[valid_indices]
        times_ms = [1000 * (t * snd.get_time_step()) for t in valid_indices]

        # 시작 시간을 0ms로 맞추기 위해 각 시간 값을 시작 시간에서 뺍니다.
        start_time = times_ms[0]
        times_ms = [t - start_time for t in times_ms]

        # Z-score normalization을 적용하여 음성 데이터를 표준화하고 크기 보정
        normalized_pitch_values = zscore(pitch_values)

        # 슬라이딩 윈도우 평균 계산
        smoothed_pitch_values = np.convolve(normalized_pitch_values, np.ones(window_size) / window_size, mode='same')

        # 시작점을 0으로 맞추기 위해 각 피치 컨투어의 값을 시작점의 값으로 뺍니다.
        smoothed_pitch_values -= smoothed_pitch_values[0]

        # 파일의 길이를 target_length에 맞추기 위해 시간을 확대하고 pitch 값을 보간합니다.
        times_ms = np.linspace(0, target_length, len(times_ms))
        smoothed_pitch_values = np.interp(times_ms, np.linspace(0, times_ms[-1], len(smoothed_pitch_values)), smoothed_pitch_values)

        return times_ms, smoothed_pitch_values

    plt.figure(facecolor='#F9E0AE')

    # 첫 번째 음성 파일 그래프 그리기
    times_ms1, smoothed_pitch_values1 = extract_and_process_pitch(sound_file1)
    plt.plot(times_ms1, smoothed_pitch_values1, linewidth=5, color='#FC8621', label='ORTOOREE')

    # 두 번째 음성 파일 그래프 그리기
    times_ms2, smoothed_pitch_values2 = extract_and_process_pitch(sound_file2)
    plt.plot(times_ms2, smoothed_pitch_values2, linewidth=5, color='#B14000', label='USER')

    # 그래프 설정
    plt.xlabel('Time (ms)')
    plt.ylabel('Pitch')
    plt.rc('axes', labelsize=15)   # x,y축 label 폰트 크기
    plt.yticks(ticks=[])
    plt.xticks(ticks=[])
    ax = plt.gca()
    ax.set_facecolor('#F9E0AE')
    plt.grid(False)
    plt.gca().spines['right'].set_visible(False) #오른쪽 테두리 제거
    plt.gca().spines['top'].set_visible(False) #위 테두리 제거
    plt.gca().spines['left'].set_visible(False) #왼쪽 테두리 제거
    plt.gca().spines['bottom'].set_visible(False) #아래 테두리 제거
    plt.legend(frameon=False, loc='upper left')


    random_path = generate_random_string()
    # 이미지 경로 설정
    pitchGraph_path = f'static/images/pitchGraph/'
    
    if not os.path.exists(pitchGraph_path):
        os.makedirs(pitchGraph_path)

    image_path = f'static/images/pitchGraph/{random_path}.png'

    plt.savefig(image_path)
    plt.close()

    image_url = url_for('static', filename=f'images/pitchGraph/{random_path}.png', _external=True)

    return image_url
    


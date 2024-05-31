import parselmouth
import numpy as np
from scipy.stats import zscore
from scipy.stats import pearsonr

def extract_pitch_from_sound_file(sound_file, target_length=10, window_size=25):
    # 음성 파일에서 pitch 추출
    snd = parselmouth.Sound(sound_file)
    pitch = snd.to_pitch()

    # pitch 값 추출
    pitch_values = pitch.selected_array['frequency']

    # NaN을 제외한 pitch 값만 추출
    valid_indices = np.where(pitch_values != 0)[0]
    pitch_values = pitch_values[valid_indices]
    times_ms = [1000 * (t * snd.get_time_step()) for t in valid_indices]

    normalized_pitch_values = zscore(pitch_values)

    # 시작 시간을 0ms로 맞추기 위해 각 시간 값을 시작 시간에서 뺍니다.
    start_time = times_ms[0]
    times_ms = [t - start_time for t in times_ms]

    # Z-score normalization을 적용하여 음성 데이터를 표준화하고 크기 보정
    normalized_pitch_values = zscore(pitch_values)

    # 슬라이딩 윈도우 평균 계산
    smoothed_pitch_values = np.convolve(normalized_pitch_values, np.ones(window_size)/window_size, mode='same')

    # 시작점을 0으로 맞추기 위해 각 피치 컨투어의 값을 시작점의 값으로 뺍니다.
    smoothed_pitch_values -= smoothed_pitch_values[0]

    # 파일의 길이를 target_length에 맞추기 위해 시간을 확대하고 pitch 값을 보간합니다.
    times_ms = np.linspace(0, target_length, len(times_ms))
    smoothed_pitch_values = np.interp(times_ms, np.linspace(0, times_ms[-1], len(smoothed_pitch_values)), smoothed_pitch_values)

    return smoothed_pitch_values

def pad_to_equal_length(array1, array2):
    # 두 배열의 길이를 맞추기 위해 짧은 쪽을 패딩으로 확장
    max_length = max(len(array1), len(array2))
    padded_array1 = np.pad(array1, (0, max_length - len(array1)), mode='edge')
    padded_array2 = np.pad(array2, (0, max_length - len(array2)), mode='edge')
    return padded_array1, padded_array2

def calculate_similarity(pitch_values1, pitch_values2):
    # 피치 값 정규화
    normalized_pitch1 = pitch_values1
    normalized_pitch2 = pitch_values2

    # 두 데이터의 길이를 맞춤
    final_pitch1, final_pitch2 = pad_to_equal_length(normalized_pitch1, normalized_pitch2)

    # 상관관계 계산
    correlation_coefficient, _ = pearsonr(final_pitch1, final_pitch2)

    # 상관관계 계수의 절대값 반환
    return (1+correlation_coefficient)

def get_similarity_score(sound_file1, sound_file2):
    # 첫 번째 음성 파일에서 pitch 값 추출
    pitch_values1 = extract_pitch_from_sound_file(sound_file1)

    # 두 번째 음성 파일에서 pitch 값 추출
    pitch_values2 = extract_pitch_from_sound_file(sound_file2)

    # 유사성 계산
    similarity = calculate_similarity(pitch_values1, pitch_values2)
    similarity_score = round(similarity * 50)

    return similarity_score
